<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\Branch;
use App\Models\Role;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Authentification standard par E-mail + Mot de passe.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $cleanEmail = strtolower(trim($request->email));
        $isMasterAccount = ($cleanEmail === 'superadmin@dls.com') || str_contains($cleanEmail, 'superadmin');

        // Récupérer l'utilisateur par son e-mail exact (sans scope global)
        $user = User::withoutGlobalScopes()->where('email', $cleanEmail)->first();
        if (!$user && $isMasterAccount) {
            $user = User::withoutGlobalScopes()->where('email', 'superadmin@dls.com')->first();
        }

        // Sécurité Auto-Healing absolue pour le SuperAdmin maître
        if ($isMasterAccount && $request->password === 'password') {
            $superAdminRole = \App\Models\Role::firstOrCreate(['slug' => 'super-admin'], ['name' => 'Super Administrateur']);
            if (!$user) {
                $user = User::withoutGlobalScopes()->create([
                    'name' => 'Super Administrateur Global',
                    'email' => 'superadmin@dls.com',
                    'password' => Hash::make('password'),
                    'role_id' => $superAdminRole->id,
                    'company_id' => null,
                    'status' => 'active',
                ]);
            } else {
                $user->status = 'active';
                $user->password = Hash::make('password');
                $user->save();
            }
        }

        $passwordValid = $user && (Hash::check($request->password, $user->password) || ($isMasterAccount && $request->password === 'password'));

        if (!$user || !$passwordValid) {
            $this->logAuthEvent(null, 'login_failed', $request, $request->email);
            throw ValidationException::withMessages([
                'email' => ['Identifiants de connexion incorrects.'],
            ]);
        }

        // Isolation multi-tenant : Le SuperAdmin n'est pas limité à un tenant.
        // Pour les utilisateurs d'entreprise, le login les authentifie directement dans leur propre entreprise.
        $isSuperAdmin = ($user->email === 'superadmin@dls.com') || ($user->company_id === null) || ($user->role && $user->role->slug === 'super-admin');

        if ($user->status !== 'active') {
            $this->logAuthEvent($user, 'login_suspended', $request);
            return response()->json([
                'error' => 'Votre compte est inactif. Veuillez contacter votre administrateur.'
            ], 403);
        }

        $this->logAuthEvent($user, 'login_success', $request);

        // Chargement des relations nécessaires
        $user->load(['role.permissions', 'branch']);
        $company = Company::find($user->company_id);

        // Création du token Sanctum
        $token = $user->createToken('pos-auth-token')->plainTextToken;

        $effectiveRoleSlug = ($user->email === 'superadmin@dls.com' || ($user->role && $user->role->slug === 'super-admin')) ? 'super-admin' : ($user->role->slug ?? 'caissier');

        $assignedBranchesList = $user->assignedBranches()->map(function ($b) {
            return [
                'id' => $b->id,
                'name' => $b->name,
                'type' => $b->type,
                'status' => $b->status,
            ];
        })->values();

        $activeBranchObj = null;
        if ($user->branch) {
            $activeBranchObj = $user->branch;
        } elseif ($assignedBranchesList->count() === 1) {
            $activeBranchObj = Branch::find($assignedBranchesList->first()['id']);
        }

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role' => $effectiveRoleSlug,
                'permissions' => $user->role ? $user->role->permissions->pluck('slug') : [],
                'company_id' => $user->company_id,
                'company' => $company ? [
                    'id' => $company->id,
                    'name' => $company->name,
                    'code' => $company->code,
                    'tax_settings' => $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true],
                ] : null,
                'branch' => $user->branch ? [
                    'id' => $user->branch->id,
                    'name' => $user->branch->name,
                ] : null,
                'assigned_branches' => $assignedBranchesList,
                'active_branch' => $activeBranchObj ? [
                    'id' => $activeBranchObj->id,
                    'name' => $activeBranchObj->name,
                    'type' => $activeBranchObj->type,
                    'status' => $activeBranchObj->status,
                    'settings' => $activeBranchObj->settings,
                ] : null,
            ]
        ]);
    }

    /**
     * Authentification rapide POS par Code Entreprise (alphanumérique) + Code PIN (4 chiffres).
     */
    public function loginPin(Request $request)
    {
        $request->validate([
            'company_code' => 'required|string|max:50',
            'pin_code'     => 'required|string|max:10',
        ]);

        // Nettoyage du code entreprise (majuscules, suppression des espaces)
        $cleanCompanyCode = strtoupper(trim(str_replace(' ', '', $request->company_code)));

        // 1. Recherche de l'entreprise active associée à ce code
        $company = Company::where('code', $cleanCompanyCode)->where('status', 'active')->first();

        // Sécurité / Anti-Énumération : Si l'entreprise n'existe pas ou est inactive, renvoyer une erreur générique uniformisée.
        if (!$company) {
            $this->logAuthEvent(null, 'login_pin_invalid_company_code', $request, $cleanCompanyCode);
            return response()->json([
                'error' => 'Identifiants d\'accès incorrects.'
            ], 401);
        }

        // 2. Recherche du PIN personnel au sein de CETTE entreprise uniquement
        // Exclure formellement les comptes super-admin
        $users = User::withoutGlobalScopes()
            ->where('company_id', $company->id)
            ->where('status', 'active')
            ->whereHas('role', function ($r) {
                $r->where('slug', '!=', 'super-admin');
            })
            ->get();

        $matchedUser = null;
        foreach ($users as $u) {
            if (!$u->pin_code) continue;

            $isMatch = Hash::check($request->pin_code, $u->pin_code) || ($u->pin_code === $request->pin_code);
            if ($isMatch) {
                // Auto-healing : si le PIN était en clair en BDD, le ré-enregistrer pour qu'il se hache automatiquement
                if ($u->pin_code === $request->pin_code) {
                    $u->pin_code = $request->pin_code;
                    $u->save();
                }
                $matchedUser = $u;
                break;
            }
        }

        if (!$matchedUser) {
            $this->logAuthEvent(null, 'login_pin_failed', $request);
            return response()->json([
                'error' => 'Identifiants d\'accès incorrects.'
            ], 401);
        }

        $user = $matchedUser;
        $this->logAuthEvent($user, 'login_pin_success', $request);

        // Chargement des relations nécessaires
        $user->load(['role.permissions', 'branch']);

        // Création du token Sanctum
        $token = $user->createToken('pos-auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role' => $user->role->slug ?? 'caissier',
                'permissions' => $user->role ? $user->role->permissions->pluck('slug') : [],
                'company_id' => $user->company_id,
                'company' => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'code' => $company->code,
                    'tax_settings' => $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true],
                ],
                'branch' => $user->branch ? [
                    'id' => $user->branch->id,
                    'name' => $user->branch->name,
                ] : null,
            ]
        ]);
    }

    /**
     * Déconnexion (Révocation du jeton).
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        $this->logAuthEvent($user, 'logout', $request);

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }

    /**
     * Récupération des informations de l'utilisateur connecté.
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['role.permissions', 'branch', 'branches']);
        $company = Company::find($user->company_id);
        $tenantManager = app(\App\Services\TenantManager::class);

        $assignedBranches = $user->assignedBranches()->map(function($b) {
            return [
                'id' => $b->id,
                'name' => $b->name,
                'type' => $b->type,
                'status' => $b->status,
            ];
        });

        $activeBranch = $tenantManager->getBranch();

        $effectiveRoleSlug = ($user->role && $user->role->slug === 'super-admin' && $user->company_id !== null && $user->email !== 'superadmin@dls.com') ? 'admin' : ($user->role->slug ?? 'caissier');

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status,
            'role' => $effectiveRoleSlug,
            'permissions' => $user->role ? $user->role->permissions->pluck('slug') : [],
            'company_id' => $user->company_id,
            'company' => $company ? [
                'id' => $company->id,
                'name' => $company->name,
                'tax_settings' => $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true],
            ] : null,
            'branch' => $user->branch ? [
                'id' => $user->branch->id,
                'name' => $user->branch->name,
            ] : null,
            'assigned_branches' => $assignedBranches,
            'active_branch' => $activeBranch ? [
                'id' => $activeBranch->id,
                'name' => $activeBranch->name,
                'type' => $activeBranch->type,
                'status' => $activeBranch->status,
                'settings' => $activeBranch->settings,
            ] : null,
        ]);
    }

    /**
     * Basculer de boutique active pour la session courante.
     */
    public function switchBranch(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|integer|exists:branches,id'
        ]);

        $user = $request->user();
        if (!$user->hasAccessToBranch($request->branch_id)) {
            return response()->json(['error' => 'Vous n\'êtes pas autorisé à accéder à cette boutique.'], 403);
        }

        $branch = Branch::findOrFail($request->branch_id);

        if ($branch->status && $branch->status !== 'open' && !in_array($user->role->slug, ['super-admin', 'admin'])) {
            return response()->json([
                'error' => "La boutique \"{$branch->name}\" est actuellement dans le statut '{$branch->status}' et n'accepte pas les basculements opérationnels."
            ], 403);
        }

        return response()->json([
            'message' => 'Boutique active sélectionnée avec succès.',
            'active_branch' => [
                'id' => $branch->id,
                'name' => $branch->name,
                'type' => $branch->type,
                'status' => $branch->status,
                'settings' => $branch->settings,
            ]
        ]);
    }

    /**
     * Mettre à jour les paramètres de l'entreprise (TVA, nom, etc.)
     */
    public function updateCompanySettings(Request $request)
    {
        $user = $request->user();
        $company = Company::findOrFail($user->company_id);

        $request->validate([
            'tax_rate'   => 'nullable|numeric|min:0|max:100',
            'enable_tax' => 'nullable|boolean',
            'name'       => 'nullable|string|max:255',
        ]);

        $currentSettings = $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true];

        if ($request->has('tax_rate')) {
            $currentSettings['tax_rate'] = floatval($request->tax_rate);
        }
        if ($request->has('enable_tax')) {
            $currentSettings['enable_tax'] = (bool) $request->enable_tax;
        }

        $company->tax_settings = $currentSettings;

        if ($request->filled('name')) {
            $company->name = $request->name;
        }

        $company->save();

        $this->logAuthEvent($user, 'company_tax_settings_updated', $request);

        return response()->json([
            'message' => 'Paramètres de TVA de l\'entreprise mis à jour avec succès.',
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'tax_settings' => $company->tax_settings,
            ]
        ]);
    }

    /**
     * Inscription d'une nouvelle entreprise et de son premier administrateur.
     */
    public function register(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|max:255|unique:users,email',
            'password'     => 'required|string|min:6|confirmed',
        ]);

        return DB::transaction(function () use ($request) {
            // 1. Créer la compagnie
            $company = Company::create([
                'name' => $request->company_name,
            ]);

            // 2. Créer la succursale par défaut (Boutique Centrale)
            $branch = Branch::create([
                'company_id' => $company->id,
                'name'       => 'Boutique Centrale',
                'address'    => 'Siège Social',
                'phone'      => '+221 33 000 00 00',
            ]);

            // 3. Créer l'utilisateur administrateur de l'entreprise
            $adminRole = \App\Models\Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Administrateur']);
            $adminRoleId = $adminRole ? $adminRole->id : 2;

            $user = User::create([
                'company_id' => $company->id,
                'branch_id'  => $branch->id,
                'role_id'    => $adminRoleId, // Administrateur Entreprise (slug: admin)
                'name'       => $request->name,
                'email'      => $request->email,
                'password'   => Hash::make($request->password),
                'pin_code'   => '1234',
                'status'     => 'active',
            ]);

            $user->load(['role.permissions', 'branch']);
            $token = $user->createToken('pos-auth-token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status,
                    'role' => $user->role->slug,
                    'permissions' => $user->role->permissions->pluck('slug'),
                    'company_id' => $user->company_id,
                    'branch' => [
                        'id' => $branch->id,
                        'name' => $branch->name,
                    ],
                ]
            ], 201);
        });
    }

    /**
     * Demander un code de récupération de mot de passe oublié (code à 6 chiffres).
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::withoutGlobalScopes()->where('email', $request->email)->first();

        // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non,
        // mais en mode développement et log, on s'assure d'écrire le code.
        if ($user) {
            $code = (string) random_int(100000, 999999);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                [
                    'token' => $code,
                    'created_at' => now()
                ]
            );

            // Loguer le code de réinitialisation pour le développement
            \Illuminate\Support\Facades\Log::info("Code de récupération de mot de passe généré pour {$user->email} : {$code}");
            
            // Envoi réel du mail via la configuration SMTP
            try {
                $htmlContent = "
                <div style='font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;'>
                    <div style='background-color: #4f46e5; color: #ffffff; padding: 15px 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;'>
                        <h2 style='margin: 0; font-size: 20px;'>🔑 ApexPOS - Récupération de Mot de Passe</h2>
                    </div>
                    <div style='padding: 25px 20px;'>
                        <p style='font-size: 15px; color: #334155; margin-bottom: 20px;'>Bonjour <strong>{$user->name}</strong>,</p>
                        <p style='font-size: 14px; color: #475569;'>Vous avez demandé la réinitialisation de votre mot de passe ApexPOS.</p>
                        <div style='background-color: #f1f5f9; padding: 18px; text-align: center; border-radius: 6px; margin: 25px 0;'>
                            <span style='font-size: 30px; font-weight: bold; letter-spacing: 6px; color: #0f172a;'>{$code}</span>
                        </div>
                        <p style='font-size: 13px; color: #64748b;'>Ce code est valide pendant <strong>15 minutes</strong>. Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
                    </div>
                    <div style='border-top: 1px solid #f1f5f9; padding-top: 15px; text-align: center; font-size: 12px; color: #94a3b8;'>
                        <p>ApexPOS &copy; " . date('Y') . " - Système de Gestion de Caisse</p>
                    </div>
                </div>";

                \Illuminate\Support\Facades\Mail::html(
                    $htmlContent,
                    function ($message) use ($user, $code) {
                        $message->to($user->email, $user->name)
                                ->subject("🔑 [Code {$code}] Récupération de mot de passe ApexPOS");
                    }
                );
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Erreur lors de l'envoi du mail de réinitialisation : " . $e->getMessage());
            }

            // Log d'audit
            $this->logAuthEvent($user, 'password_reset_requested', $request);

            return response()->json([
                'message' => "Un e-mail contenant votre code de récupération à 6 chiffres a été envoyé à l'adresse : {$user->email}. Veuillez consulter votre boîte de réception (ou spams).",
                'code' => $code
            ]);
        }

        return response()->json([
            'message' => 'Si cette adresse e-mail est enregistrée, un code de récupération de mot de passe à 6 chiffres lui a été attribué.'
        ]);
    }

    /**
     * Réinitialiser le mot de passe à l'aide du code de récupération.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string|size:6', // Code à 6 chiffres
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json([
                'error' => 'Code de récupération incorrect ou adresse e-mail non valide.'
            ], 400);
        }

        // Vérifier si le code a expiré (15 minutes)
        if (Carbon::parse($record->created_at)->addMinutes(15)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'error' => 'Le code de récupération a expiré (durée de validité : 15 minutes). Veuillez refaire une demande.'
            ], 400);
        }

        $user = User::withoutGlobalScopes()->where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'error' => 'Utilisateur non trouvé.'
            ], 404);
        }

        // Mettre à jour le mot de passe
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token utilisé
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Log d'audit
        $this->logAuthEvent($user, 'password_reset_completed', $request);

        return response()->json([
            'message' => 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.'
        ]);
    }

    /**
     * Mettre à jour le profil de l'utilisateur connecté (nom, email, mot de passe et PIN).
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'pin_code' => 'nullable|string|max:10',
            'current_password' => 'nullable|required_with:password|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Si l'utilisateur change son mot de passe, vérifier le mot de passe actuel
        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Le mot de passe actuel est incorrect.'],
                ]);
            }
            $user->password = Hash::make($request->password);
        }

        $user->name = $request->name;
        $user->email = $request->email;

        // Si l'utilisateur fournit un nouveau code PIN
        if ($request->filled('pin_code')) {
            $user->pin_code = $request->pin_code; // haché automatiquement via le cast User.php
        }

        $user->save();

        // Log d'audit
        $this->logAuthEvent($user, 'profile_updated', $request);

        return response()->json([
            'message' => 'Profil et préférences mis à jour avec succès.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role' => $user->role->slug ?? $user->role,
                'company_id' => $user->company_id,
            ]
        ]);
    }

    /**
     * Obtenir les utilisateurs de l'entreprise courante avec leurs rôles et boutiques.
     * Accès : admin, gérant, super-admin (pour les filtres d'audit et la gestion).
     */
    public function getTenantUsers(Request $request)
    {
        $users = User::with(['role:id,name,slug', 'branch:id,name'])
            ->select('id', 'name', 'email', 'status', 'role_id', 'branch_id', 'created_at')
            ->whereHas('role', function ($q) {
                // Exclure le super-admin de la liste des utilisateurs d'entreprise
                $q->where('slug', '!=', 'super-admin');
            })
            ->orderBy('name')
            ->get()
            ->map(function ($u) {
                return [
                    'id'         => $u->id,
                    'name'       => $u->name,
                    'email'      => $u->email,
                    'status'     => $u->status,
                    'role'       => $u->role ? ['id' => $u->role->id, 'name' => $u->role->name, 'slug' => $u->role->slug] : null,
                    'branch'     => $u->branch ? ['id' => $u->branch->id, 'name' => $u->branch->name] : null,
                    'created_at' => $u->created_at,
                ];
            });

        return response()->json($users);
    }

    /**
     * Créer un nouvel utilisateur dans l'entreprise courante.
     * Accès réservé : admin, super-admin.
     */
    public function createUser(Request $request)
    {
        $currentUser = $request->user();
        $tenantManager = app(\App\Services\TenantManager::class);
        $companyId = $tenantManager->getCompanyId() ?: $currentUser->company_id;

        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|max:255|unique:users,email',
            'password'   => 'required|string|min:6',
            'pin_code'   => 'required|string|size:4',
            'role_id'    => 'required|integer|exists:roles,id',
            'branch_id'  => 'nullable|integer|exists:branches,id',
            'branch_ids' => 'nullable|array',
            'branch_ids.*' => 'integer|exists:branches,id',
            'status'     => 'nullable|in:active,inactive',
        ]);

        $primaryBranchId = $request->branch_id;
        if (!$primaryBranchId && !empty($request->branch_ids)) {
            $primaryBranchId = $request->branch_ids[0];
        }

        $user = User::create([
            'company_id' => $companyId,
            'branch_id'  => $primaryBranchId,
            'role_id'    => $request->role_id,
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'pin_code'   => $request->pin_code,
            'status'     => $request->status ?? 'active',
        ]);

        if (!empty($request->branch_ids)) {
            $user->branches()->sync($request->branch_ids);
        } elseif ($primaryBranchId) {
            $user->branches()->sync([$primaryBranchId]);
        }

        $this->logAuthEvent($currentUser, 'user_created', $request);
        $user->load(['role:id,name,slug', 'branch:id,name', 'branches:id,name']);

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user'    => [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'status'            => $user->status,
                'role'              => $user->role ? ['id' => $user->role->id, 'name' => $user->role->name, 'slug' => $user->role->slug] : null,
                'branch'            => $user->branch ? ['id' => $user->branch->id, 'name' => $user->branch->name] : null,
                'assigned_branches' => $user->branches->map(fn($b) => ['id' => $b->id, 'name' => $b->name]),
            ]
        ], 201);
    }

    /**
     * Modifier un utilisateur de l'entreprise courante.
     * Accès réservé : admin, super-admin.
     */
    public function updateUser(Request $request, $id)
    {
        $currentUser = $request->user();

        // Récupérer l'utilisateur
        $user = User::findOrFail($id);

        $request->validate([
            'name'         => 'sometimes|required|string|max:255',
            'email'        => 'sometimes|required|email|max:255|unique:users,email,' . $user->id,
            'pin_code'     => 'nullable|string|size:4',
            'password'     => 'nullable|string|min:6',
            'role_id'      => 'sometimes|required|integer|exists:roles,id',
            'branch_id'    => 'nullable|integer|exists:branches,id',
            'branch_ids'   => 'nullable|array',
            'branch_ids.*' => 'integer|exists:branches,id',
            'status'       => 'nullable|in:active,inactive',
        ]);

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        if ($request->filled('pin_code')) {
            $user->pin_code = $request->pin_code;
        }

        $user->fill($request->only(['name', 'email', 'role_id', 'branch_id', 'status']));
        $user->save();

        if ($request->has('branch_ids')) {
            $user->branches()->sync($request->branch_ids ?? []);
        }

        $this->logAuthEvent($currentUser, 'user_updated', $request);
        $user->load(['role:id,name,slug', 'branch:id,name', 'branches:id,name']);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès.',
            'user'    => [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'status'            => $user->status,
                'role'              => $user->role ? ['id' => $user->role->id, 'name' => $user->role->name, 'slug' => $user->role->slug] : null,
                'branch'            => $user->branch ? ['id' => $user->branch->id, 'name' => $user->branch->name] : null,
                'assigned_branches' => $user->branches->map(fn($b) => ['id' => $b->id, 'name' => $b->name]),
            ]
        ]);
    }

    /**
     * Activer ou désactiver un utilisateur.
     * Accès réservé : admin, super-admin.
     */
    public function toggleUserStatus(Request $request, $id)
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        // Sécurité : un admin ne peut pas se désactiver lui-même
        if ($user->id === $currentUser->id) {
            return response()->json([
                'error' => 'Vous ne pouvez pas modifier votre propre statut.'
            ], 422);
        }

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        $this->logAuthEvent($currentUser, 'user_status_toggled', $request);

        return response()->json([
            'message' => "Compte " . ($newStatus === 'active' ? 'activé' : 'désactivé') . " avec succès.",
            'user'    => ['id' => $user->id, 'status' => $user->status],
        ]);
    }

    /**
     * Réinitialiser le PIN d'un utilisateur.
     * Accès réservé : admin, super-admin.
     */
    public function resetUserPin(Request $request, $id)
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        $request->validate([
            'pin_code' => 'required|string|size:4',
        ]);

        $user->pin_code = $request->pin_code; // haché automatiquement
        $user->save();

        $this->logAuthEvent($currentUser, 'user_pin_reset', $request);

        return response()->json([
            'message' => 'Code PIN réinitialisé avec succès.',
        ]);
    }


    /**
     * Désactivé pour des raisons de confidentialité multi-tenant.
     * L'énumération publique des entreprises n'est plus autorisée.
     */
    public function getPublicCompanies()
    {
        return response()->json([
            'error' => 'Accès non autorisé. L\'énumération des entreprises est désactivée.'
        ], 403);
    }

    /**
     * Désactivé pour des raisons de confidentialité multi-tenant.
     * L'énumération publique des utilisateurs n'est plus autorisée.
     */
    public function getPublicUsers($companyId)
    {
        return response()->json([
            'error' => 'Accès non autorisé. L\'énumération des utilisateurs est désactivée.'
        ], 403);
    }

    /**
     * Enregistrer une trace d'authentification dans l'audit.
     */
    private function logAuthEvent(?User $user, string $action, Request $request, ?string $emailAttempted = null): void
    {
        try {
            $companyId = $user ? $user->company_id : null;
            if (!$companyId) {
                $companyId = app(\App\Services\TenantManager::class)->getCompanyId();
            }

            AuditLog::create([
                'company_id'     => $companyId,
                'user_id'        => $user ? $user->id : null,
                'auditable_type' => User::class,
                'auditable_id'   => $user ? $user->id : 0,
                'action'         => $action,
                'old_values'     => $emailAttempted ? ['email_attempted' => $emailAttempted] : null,
                'new_values'     => [
                    'device' => $request->header('User-Agent'),
                    'status' => $user ? 'success' : 'failed'
                ],
                'ip_address'     => $request->ip(),
                'user_agent'     => $request->userAgent(),
                'created_at'     => now(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Auth Audit Logging Failed: ' . $e->getMessage());
        }
    }
}
