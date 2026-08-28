<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class GitHubAuthController extends Controller
{
    /**
     * Redirige l'utilisateur vers la page d'autorisation GitHub OAuth.
     * Route : GET /api/v1/auth/github/redirect
     */
    public function redirect(Request $request)
    {
        $clientId    = config('services.github.client_id', env('GITHUB_CLIENT_ID'));
        $redirectUri = config('services.github.redirect_uri', env('GITHUB_REDIRECT_URI', config('app.url') . '/api/v1/auth/github/callback'));

        if (!$clientId) {
            return $this->returnError($request, 'GITHUB_CONFIG_MISSING', 'L\'authentification GitHub n\'est pas configurée sur le serveur (CLIENT_ID manquant).', 500);
        }

        $timestamp = time();
        $random    = Str::random(16);
        $sig       = hash_hmac('sha256', $timestamp . '.' . $random, config('app.key'));
        $state     = base64_encode($timestamp . '.' . $random . '.' . $sig);
        Cache::put('github_oauth_state_' . $state, true, 900);

        $params = http_build_query([
            'client_id'    => $clientId,
            'redirect_uri' => $redirectUri,
            'scope'        => 'user:email',
            'state'        => $state,
            'allow_signup' => 'true',
        ]);

        $url = 'https://github.com/login/oauth/authorize?' . $params;

        if ($request->wantsJson()) {
            return response()->json(['url' => $url]);
        }

        return redirect()->away($url);
    }

    /**
     * Traite le retour OAuth de GitHub.
     * Route : GET /api/v1/auth/github/callback
     */
    public function callback(Request $request)
    {
        $code  = $request->input('code');
        $state = $request->input('state');

        if ($request->has('error')) {
            return $this->returnError($request, 'GITHUB_CANCELLED', 'Connexion via GitHub annulée : ' . $request->input('error_description', 'Accès refusé.'), 400);
        }

        if (!$code) {
            return $this->returnError($request, 'GITHUB_CODE_MISSING', 'Code d\'autorisation GitHub manquant.', 400);
        }

        $clientId     = config('services.github.client_id', env('GITHUB_CLIENT_ID'));
        $clientSecret = config('services.github.client_secret', env('GITHUB_CLIENT_SECRET'));
        $redirectUri  = config('services.github.redirect_uri', env('GITHUB_REDIRECT_URI', config('app.url') . '/api/v1/auth/github/callback'));

        // Échange du code contre un jeton d'accès GitHub
        $tokenResponse = Http::asForm()
            ->withHeaders(['Accept' => 'application/json'])
            ->post('https://github.com/login/oauth/access_token', [
                'client_id'     => $clientId,
                'client_secret' => $clientSecret,
                'code'          => $code,
                'redirect_uri'  => $redirectUri,
                'state'         => $state,
            ]);

        if ($tokenResponse->failed() || !isset($tokenResponse->json()['access_token'])) {
            return $this->returnError($request, 'GITHUB_TOKEN_FAILED', 'Impossible d\'échanger le code d\'autorisation GitHub contre un jeton.', 400);
        }

        $accessToken = $tokenResponse->json()['access_token'];

        // Récupération du profil utilisateur GitHub
        $userResponse = Http::withToken($accessToken)
            ->withHeaders(['User-Agent' => 'ApexPOS-App'])
            ->get('https://api.github.com/user');

        if ($userResponse->failed()) {
            return $this->returnError($request, 'GITHUB_PROFILE_FAILED', 'Impossible de récupérer le profil utilisateur GitHub.', 400);
        }

        $githubData = $userResponse->json();
        $githubId   = (string) ($githubData['id'] ?? '');
        $username   = $githubData['login'] ?? '';
        $name       = $githubData['name'] ?? $username;
        $avatar     = $githubData['avatar_url'] ?? null;
        $email      = strtolower(trim($githubData['email'] ?? ''));

        // Si l'e-mail est privé ou nul dans le profil public, récupérer l'e-mail principal via l'API GitHub Emails
        if (empty($email)) {
            $emailsResponse = Http::withToken($accessToken)
                ->withHeaders(['User-Agent' => 'ApexPOS-App'])
                ->get('https://api.github.com/user/emails');

            if ($emailsResponse->successful()) {
                $emails = $emailsResponse->json();
                foreach ($emails as $em) {
                    if (!empty($em['primary']) && !empty($em['verified'])) {
                        $email = strtolower(trim($em['email']));
                        break;
                    }
                }
                if (empty($email) && !empty($emails[0]['email'])) {
                    $email = strtolower(trim($emails[0]['email']));
                }
            }
        }

        if (empty($email)) {
            return $this->returnError($request, 'GITHUB_EMAIL_MISSING', 'Impossible de récupérer une adresse e-mail vérifiée à partir de votre compte GitHub.', 400);
        }

        // Recherche du compte utilisateur existant
        $user = User::withoutGlobalScopes()->where('github_id', $githubId)->first();

        if (!$user) {
            $user = User::withoutGlobalScopes()->where('email', $email)->first()
                 ?: User::withoutGlobalScopes()->whereRaw('LOWER(TRIM(email)) = ?', [$email])->first();
        }

        // Auto-provisioning / Inscription avec GitHub si compte inexistant
        if (!$user) {
            $companyName = !empty($name) ? $name : $username;
            $companyCode = strtoupper(Str::random(4) . '-' . Str::random(4));

            $company = Company::create([
                'name'         => $companyName,
                'code'         => $companyCode,
                'email'        => $email,
                'phone'        => '',
                'address'      => '',
                'currency'     => 'XOF',
                'status'       => 'active',
                'is_suspended' => false,
            ]);

            $branch = Branch::create([
                'company_id' => $company->id,
                'name'       => 'Boutique Principale',
                'address'    => 'Siège Social',
                'phone'      => '',
                'status'     => 'open',
            ]);

            $adminRole = \App\Models\Role::withoutGlobalScopes()->firstOrCreate(['slug' => 'admin'], ['name' => 'Administrateur']);
            $adminRoleId = $adminRole ? $adminRole->id : 2;
            $randomPin = (string) random_int(1000, 9999);

            $user = User::create([
                'company_id'        => $company->id,
                'branch_id'         => $branch->id,
                'role_id'           => $adminRoleId,
                'name'              => $name ?: $username,
                'email'             => $email,
                'password'          => Hash::make(Str::random(16)),
                'pin_code'          => Crypt::encryptString($randomPin),
                'status'            => 'active',
                'email_verified_at' => now(),
                'github_id'         => $githubId,
                'github_username'   => $username,
                'github_avatar'     => $avatar,
            ]);

            if (method_exists($user, 'branches')) {
                $user->branches()->syncWithoutDetaching([$branch->id]);
            }

            try {
                app(\App\Services\EmailService::class)->sendWelcomeEmail($user, $company, $randomPin);
            } catch (\Throwable $e) {}
        } else {
            // Mise à jour de la liaison GitHub
            $user->update([
                'github_id'         => $githubId,
                'github_username'   => $username,
                'github_avatar'     => $avatar ?: $user->github_avatar,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);
        }

        if ($user->status !== 'active') {
            return $this->returnError($request, 'USER_SUSPENDED', 'Votre compte ApexPOS est inactif ou suspendu. Veuillez contacter votre administrateur.', 403);
        }

        // Résolution Tenant & Isolation
        $company = null;
        if ($user->company_id) {
            $company = Company::withoutGlobalScopes()->find($user->company_id);
            if ($company) {
                app(\App\Services\TenantManager::class)->setCompany($company);
            }
        }

        $user->load(['role.permissions', 'branch']);

        // Génération du Token Sanctum ApexPOS
        $token = $user->createToken('pos-github-token')->plainTextToken;

        $effectiveRoleSlug = ($user->role && $user->role->slug === 'super-admin' && $user->company_id !== null && $user->email !== 'superadmin@dls.com') ? 'admin' : ($user->role->slug ?? 'caissier');

        $userData = json_encode([
            'id'                => $user->id,
            'name'              => $user->name,
            'email'             => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'has_pin'           => !empty($user->pin_code),
            'plain_pin'         => $user->plain_pin,
            'status'            => $user->status,
            'role'              => $effectiveRoleSlug,
            'permissions'       => $user->role ? $user->role->permissions->pluck('slug') : [],
            'company_id'        => $user->company_id,
            'company'           => $company ? [
                'id'            => $company->id,
                'name'          => $company->name,
                'code'          => $company->code,
                'currency'      => $company->currency,
            ] : null,
        ]);

        $frontendUrl = env('FRONTEND_URL', config('app.frontend_url', 'https://pos.dlscorporation.ci'));
        return redirect()->away($frontendUrl . '?google_token=' . urlencode($token) . '&google_user=' . urlencode($userData));
    }

    private function returnError(Request $request, string $code, string $message, int $status)
    {
        if ($request->wantsJson()) {
            return response()->json([
                'success' => false,
                'error_code' => $code,
                'message' => $message,
            ], $status);
        }

        $frontendUrl = env('FRONTEND_URL', config('app.frontend_url', 'https://pos.dlscorporation.ci'));
        return redirect()->away($frontendUrl . '?google_error=' . urlencode($message));
    }

    private function validateState(?string $state): bool
    {
        if (!$state) return true;

        if (Cache::pull('github_oauth_state_' . $state)) {
            return true;
        }

        try {
            $decoded = base64_decode($state);
            $parts = explode('.', $decoded);
            if (count($parts) === 3) {
                [$ts, $rand, $sig] = $parts;
                $expectedSig = hash_hmac('sha256', $ts . '.' . $rand, config('app.key'));
                if (hash_equals($expectedSig, $sig) && (time() - (int)$ts) < 900) {
                    return true;
                }
            }
        } catch (\Throwable $e) {}

        return app()->environment('local', 'testing');
    }
}
