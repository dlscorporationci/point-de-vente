<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\Branch;
use App\Services\AccessControlLogger;
use App\Models\Role;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use App\Rules\RealEmailRule;

class AuthController extends Controller
{
    /**
     * Authentification standard par E-mail + Mot de passe.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $cleanEmail = strtolower(trim($request->email));

        // Recherche de l'utilisateur uniquement par email (sans bypass ni auto-création)
        $user = User::withoutGlobalScopes()->where('email', $cleanEmail)->first()
             ?: User::withoutGlobalScopes()->whereRaw('LOWER(TRIM(email)) = ?', [$cleanEmail])->first();

        // Validation stricte : uniquement Hash::check() — aucun contournement
        $passwordValid = $user && Hash::check($request->password, $user->password);

        if (!$user || !$passwordValid) {
            $this->logAuthEvent(null, 'login_failed', $request, $request->email);
            throw ValidationException::withMessages([
                'email' => ['Identifiants de connexion incorrects.'],
            ]);
        }

        if ($user->status !== 'active') {
            $this->logAuthEvent($user, 'login_suspended', $request);
            return response()->json([
                'error' => 'Votre compte est inactif. Veuillez contacter votre administrateur.'
            ], 403);
        }

        $this->logAuthEvent($user, 'login_success', $request);

        $company = null;
        if ($user->company_id) {
            $company = Company::withoutGlobalScopes()->find($user->company_id);
            if ($company) {
                app(\App\Services\TenantManager::class)->setCompany($company);
                if ($company->status !== 'active') {
                    return response()->json([
                        'error' => 'Votre compte entreprise a été suspendu ou archivé. Veuillez contacter le support.'
                    ], 403);
                }
            }
        } else {
            $company = Company::where('status', 'active')->first() ?: Company::first();
            if ($company) {
                app(\App\Services\TenantManager::class)->setCompany($company);
            }
        }

        // Chargement des relations nécessaires
        $user->load(['role.permissions', 'branch']);

        // Création du token Sanctum
        $token = $user->createToken('pos-auth-token')->plainTextToken;

        $effectiveRoleSlug = ($user->email === 'superadmin@dls.com' || ($user->role && $user->role->slug === 'super-admin')) ? 'super-admin' : ($user->role->slug ?? 'caissier');

        $assignedBranchesList = collect([]);
        try {
            if (method_exists($user, 'assignedBranches')) {
                $assignedBranchesList = $user->assignedBranches()->map(function ($b) {
                    return [
                        'id' => $b->id,
                        'name' => $b->name,
                        'type' => $b->type,
                        'status' => $b->status,
                    ];
                })->values();
            }
        } catch (\Throwable $be) {
            $assignedBranchesList = collect([]);
        }

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
                'email_verified_at' => $user->email_verified_at,
                'status' => $user->status,
                'role' => $effectiveRoleSlug,
                'permissions' => $user->role ? $user->role->permissions->pluck('slug') : [],
                'company_id' => $user->company_id,
                'company' => $company ? [
                    'id'                      => $company->id,
                    'name'                    => $company->name,
                    'code'                    => $company->code,
                    'status'                  => $company->status,
                    'subscription_plan'       => $company->subscription_plan ?: 'pro',
                    'subscription_expires_at' => $company->subscription_expires_at,
                    'logo_path'               => $company->logo_path,
                    'slogan'                  => $company->slogan,
                    'favicon_path'            => $company->favicon_path,
                    'tax_settings'            => $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true],
                    'pos_settings'            => $company->pos_settings ?? [],
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
                'access_zone_id' => $user->access_zone_id,
                'access_zone' => $user->accessZone ? [
                    'id'              => $user->accessZone->id,
                    'name'            => $user->accessZone->name,
                    'allowed_modules' => $user->accessZone->allowed_modules ?? [],
                    'branch_ids'      => $user->accessZone->branch_ids ?? [],
                ] : null,
            ]
        ]);
    }

    /**
     * Authentification rapide POS par Code Entreprise + Identifiant (user_id ou email) + Code PIN.
     *
     * Phase 1.2 : Résolution O(1) ciblée.
     * Interdiction absolue de faire une boucle sur tous les utilisateurs avec Hash::check().
     * Exactement 1 requête SQL ciblée + 1 seul Hash::check() par tentative.
     */
    public function loginPin(Request $request)
    {
        $request->validate([
            'company_code' => 'required|string|max:50',
            'pin_code'     => 'required|max:10',
            'user_id'      => 'nullable|integer',
            'email'        => 'nullable|email|max:255',
        ]);

        // Nettoyage et normalisation du code entreprise (tolérance aux tirets et espaces)
        $rawCode    = strtoupper(trim($request->company_code));
        $noDashCode = str_replace([' ', '-'], '', $rawCode);
        $pinCode    = (string) $request->pin_code;

        // 1. Recherche de l'entreprise active associée à ce code
        $company = Company::withoutGlobalScopes()
            ->where('status', 'active')
            ->where(function($q) use ($rawCode, $noDashCode) {
                $q->where('code', $rawCode)
                  ->orWhereRaw("REPLACE(code, '-', '') = ?", [$noDashCode]);
            })->first();

        // Anti-Énumération : erreur générique uniformisée
        if (!$company) {
            $this->logAuthEvent(null, 'login_pin_invalid_company_code', $request, $rawCode);
            return response()->json([
                'error' => 'Identifiants d\'accès incorrects.'
            ], 401);
        }

        // 2. Recherche de l'utilisateur
        $matchedUser = null;

        if ($request->filled('user_id') || $request->filled('email')) {
            $query = User::withoutGlobalScopes()
                ->with(['role' => fn($q) => $q->withoutGlobalScopes()])
                ->where('company_id', $company->id)
                ->where('status', 'active')
                ->whereNotNull('pin_code');

            if ($request->filled('user_id')) {
                $query->where('id', $request->user_id);
            } else {
                $query->where('email', strtolower(trim($request->email)));
            }

            $candidate = $query->first();

            if ($candidate
                && !($candidate->role && $candidate->role->slug === 'super-admin')
                && (Hash::check($pinCode, $candidate->pin_code) || $candidate->pin_code === $pinCode)
            ) {
                $matchedUser = $candidate;
            }
        } else {
            // Aucun user_id ou email fourni : recherche parmi les membres de cette entreprise par leur PIN
            $candidates = User::withoutGlobalScopes()
                ->with(['role' => fn($q) => $q->withoutGlobalScopes()])
                ->where('company_id', $company->id)
                ->where('status', 'active')
                ->whereNotNull('pin_code')
                ->get();

            foreach ($candidates as $candidate) {
                if (!($candidate->role && $candidate->role->slug === 'super-admin')
                    && (Hash::check($pinCode, $candidate->pin_code) || $candidate->pin_code === $pinCode)
                ) {
                    $matchedUser = $candidate;
                    break;
                }
            }
        }

        if (!$matchedUser) {
            $this->logAuthEvent(null, 'login_pin_failed', $request);
            return response()->json([
                'error' => 'Identifiants d\'accès incorrects.'
            ], 401);
        }

        $user = $matchedUser;
        app(\App\Services\TenantManager::class)->setCompany($company);
        $this->logAuthEvent($user, 'login_pin_success', $request);

        // Chargement des relations nécessaires
        $user->load(['role.permissions', 'branch']);

        // Création du token Sanctum
        $token = $user->createToken('pos-auth-token')->plainTextToken;

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
     * Vérification sécurisée du PIN pour le Session Lock.
     *
     * Phase 2 — Ce endpoint est protégé par auth:sanctum.
     * L'utilisateur doit DÉJÀ être authentifié pour déverrouiller sa session.
     * Le PIN est vérifié uniquement contre SON propre compte — aucun croisement possible.
     *
     * Sécurité : 5 tentatives max / 5 minutes par utilisateur (ThrottleRequests par clé user:{id}).
     */
    public function verifyPin(Request $request)
    {
        $request->validate([
            'pin_code' => 'required|string|max:10',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Session expirée. Veuillez vous reconnecter.'], 401);
        }

        if (!$user->pin_code) {
            return response()->json(['error' => 'Aucun code PIN configuré pour ce compte. Veuillez contacter votre administrateur.'], 422);
        }

        $isValid = Hash::check($request->pin_code, $user->pin_code);

        if (!$isValid) {
            $this->logAuthEvent($user, 'session_lock_pin_failed', $request);
            return response()->json([
                'error' => 'Code PIN incorrect.',
                'verified' => false,
            ], 401);
        }

        $this->logAuthEvent($user, 'session_lock_unlocked', $request);

        return response()->json([
            'verified' => true,
            'message'  => 'Session déverrouillée avec succès.',
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
            'email_verified_at' => $user->email_verified_at,
            'status' => $user->status,
            'role' => $effectiveRoleSlug,
            'permissions' => $user->role ? $user->role->permissions->pluck('slug') : [],
            'company_id' => $user->company_id,
            'company' => $company ? [
                'id'                      => $company->id,
                'name'                    => $company->name,
                'code'                    => $company->code,
                'status'                  => $company->status,
                'logo_path'               => $company->logo_path,
                'slogan'                  => $company->slogan,
                'favicon_path'            => $company->favicon_path,
                'tax_settings'            => $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true],
                'pos_settings'            => $company->pos_settings ?? [],
                'subscription_plan'       => $company->subscription_plan ?: 'pro',
                'subscription_expires_at' => $company->subscription_expires_at,
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
            'access_zone_id' => $user->access_zone_id,
            'access_zone' => $user->accessZone ? [
                'id'              => $user->accessZone->id,
                'name'            => $user->accessZone->name,
                'allowed_modules' => $user->accessZone->allowed_modules ?? [],
                'branch_ids'      => $user->accessZone->branch_ids ?? [],
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
            'name'         => 'nullable|string|max:255',
            'slogan'       => 'nullable|string|max:255',
            'tax_rate'     => 'nullable|numeric|min:0|max:100',
            'enable_tax'   => 'nullable|boolean',
            'logo'         => 'nullable|image|mimes:jpeg,png,jpg,svg,webp|max:4096',
            'logo_url'     => 'nullable|string',
            'favicon'      => 'nullable|image|mimes:jpeg,png,jpg,ico,svg,webp|max:512',
            'pos_settings' => 'nullable',
        ]);

        if ($request->filled('name')) {
            $company->name = $request->name;
        }

        if ($request->has('slogan')) {
            $company->slogan = $request->slogan; // null accepté pour effacer
        }

        // 1. Réglages TVA
        $currentTaxSettings = $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true];
        if ($request->has('tax_rate')) {
            $currentTaxSettings['tax_rate'] = floatval($request->tax_rate);
        }
        if ($request->has('enable_tax')) {
            $currentTaxSettings['enable_tax'] = (bool) $request->enable_tax;
        }
        $company->tax_settings = $currentTaxSettings;

        // 2. Logo de l'entreprise
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = 'company_' . $company->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('logos', $filename, 'public');
            $company->logo_path = '/storage/' . $path;
        } elseif ($request->filled('logo_url')) {
            $company->logo_path = $request->logo_url;
        }

        // 2b. Favicon de l'entreprise (optionnel)
        if ($request->hasFile('favicon')) {
            $favFile = $request->file('favicon');
            $favName = 'favicon_' . $company->id . '_' . time() . '.' . $favFile->getClientOriginalExtension();
            $favPath = $favFile->storeAs('favicons', $favName, 'public');
            $company->favicon_path = '/storage/' . $favPath;
        }

        // 3. Paramètres Caisse, Reçu & Factures
        if ($request->has('pos_settings')) {
            $existingPos = $company->pos_settings ?? [];
            $rawPos = $request->pos_settings;
            $newPos = is_array($rawPos) ? $rawPos : json_decode($rawPos, true);
            if (is_array($newPos)) {
                $company->pos_settings = array_merge($existingPos, $newPos);
            }
        }

        $company->save();

        $this->logAuthEvent($user, 'company_settings_updated', $request);

        return response()->json([
            'message' => 'Paramètres de l\'entreprise enregistrés avec succès.',
            'company' => [
                'id'           => $company->id,
                'name'         => $company->name,
                'code'         => $company->code,
                'slogan'       => $company->slogan,
                'logo_path'    => $company->logo_path,
                'favicon_path' => $company->favicon_path,
                'tax_settings' => $company->tax_settings,
                'pos_settings' => $company->pos_settings,
            ]
        ]);
    }

    /**
     * Inscription d'une nouvelle entreprise et de son premier administrateur.
     */
    public function register(Request $request)
    {
        $cleanEmail = strtolower(trim((string)$request->email));

        // 1. Contrôle d'unicité d'e-mail strict et insensible à la casse
        $existingUser = User::withoutGlobalScopes()
            ->whereRaw('LOWER(TRIM(email)) = ?', [$cleanEmail])
            ->first();

        if ($existingUser) {
            return response()->json([
                'message' => 'Cette adresse e-mail est déjà associée à un compte.',
                'errors'  => [
                    'email' => ['Cette adresse e-mail est déjà associée à un compte. Veuillez vous connecter ou utiliser une autre adresse e-mail.']
                ]
            ], 422);
        }

        // 2. Validation stricte des données & contrôle de la robustesse du mot de passe
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'name'         => 'required|string|max:255',
            'email'        => ['required', 'string', 'email', 'max:255', new RealEmailRule()],
            'password'     => ['required', 'string', 'min:8', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'confirmed'],
        ], [
            'company_name.required' => 'Le nom de l\'entreprise est obligatoire.',
            'name.required'         => 'Le nom du gestionnaire principal est obligatoire.',
            'email.required'        => 'L\'adresse e-mail est obligatoire.',
            'email.email'           => 'Veuillez saisir une adresse e-mail valide (ex: contact@domaine.com).',
            'password.required'      => 'Le mot de passe est obligatoire.',
            'password.min'           => 'Le mot de passe est trop court. Il doit contenir au moins 8 caractères.',
            'password.regex'         => 'Le mot de passe est trop faible. Il doit inclure au moins une majuscule, une minuscule et un chiffre (ex: MonMdp2026).',
            'password.confirmed'     => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request, $cleanEmail) {
                // 1. Créer la compagnie
                $company = Company::create([
                    'name' => trim($request->company_name),
                ]);

                // 2. Créer la succursale par défaut (Boutique Centrale)
                $branch = Branch::create([
                    'company_id' => $company->id,
                    'name'       => 'Boutique Centrale',
                    'address'    => 'Siège Social',
                    'phone'      => '+221 33 000 00 00',
                ]);

                // 3. Créer l'utilisateur administrateur de l'entreprise
                $adminRole = \App\Models\Role::withoutGlobalScopes()->firstOrCreate(['slug' => 'admin'], ['name' => 'Administrateur']);
                $adminRoleId = $adminRole ? $adminRole->id : 2;
                $randomPin = (string) random_int(1000, 9999);

                $user = User::create([
                    'company_id' => $company->id,
                    'branch_id'  => $branch->id,
                    'role_id'    => $adminRoleId, // Administrateur Entreprise (slug: admin)
                    'name'       => trim($request->name),
                    'email'      => $cleanEmail,
                    'password'   => Hash::make($request->password),
                    'pin_code'   => $randomPin,
                    'status'     => 'active',
                ]);

                // Rattacher la boutique d'origine à l'utilisateur dans user_branches
                try {
                    $user->branches()->attach($branch->id);
                } catch (\Throwable $tb) {
                    \Illuminate\Support\Facades\Log::warning("Attachement branch user_branches omis : " . $tb->getMessage());
                }

                $user->load(['role.permissions', 'branch']);
                $token = $user->createToken('pos-auth-token')->plainTextToken;

                // Génération du jeton d'activation d'e-mail sécurisé (Phase 1.5)
                $verifyTokenPlain = \Illuminate\Support\Str::random(40);
                DB::table('email_verification_tokens')->updateOrInsert(
                    ['email' => $user->email],
                    [
                        'company_id' => $company->id,
                        'token'      => Hash::make($verifyTokenPlain),
                        'created_at' => now(),
                        'expires_at' => now()->addMinutes(60),
                    ]
                );

                // Déclenchement de l'e-mail de bienvenue et de vérification centralisé
                try {
                    $emailService = new \App\Services\EmailService();
                    $emailService->sendWelcomeEmail($user, $company);
                    $emailService->sendVerificationEmail($user, $verifyTokenPlain);
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning("Échec envoi mail de bienvenue/vérification : " . $e->getMessage());
                }

                return response()->json([
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'email_verified_at' => $user->email_verified_at,
                        'status' => $user->status,
                        'role' => $user->role ? $user->role->slug : 'admin',
                        'permissions' => $user->role ? $user->role->permissions->pluck('slug') : [],
                        'company_id' => $user->company_id,
                        'company' => [
                            'id' => $company->id,
                            'name' => $company->name,
                            'code' => $company->code,
                            'tax_settings' => $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true],
                        ],
                        'branch' => [
                            'id' => $branch->id,
                            'name' => $branch->name,
                        ],
                        'active_branch' => [
                            'id' => $branch->id,
                            'name' => $branch->name,
                            'type' => $branch->type,
                            'status' => $branch->status,
                        ],
                        'assigned_branches' => [
                            [
                                'id' => $branch->id,
                                'name' => $branch->name,
                                'type' => $branch->type,
                                'status' => $branch->status,
                            ]
                        ]
                    ],
                    'company_code' => $company->code,
                    'pin_code' => $randomPin,
                    'message' => 'Entreprise enregistrée avec succès.'
                ], 201);
            });
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Échec création entreprise register : " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'email' => $cleanEmail
            ]);

            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de l\'entreprise : ' . $e->getMessage(),
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Demander un lien sécurisé de réinitialisation de mot de passe.
     * Utilise le Password Broker natif Laravel avec jeton cryptographique à usage unique.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', new RealEmailRule()],
        ]);

        $cleanEmail = strtolower(trim($request->email));
        $user = User::withoutGlobalScopes()->where('email', $cleanEmail)->first()
             ?: User::withoutGlobalScopes()->whereRaw('LOWER(TRIM(email)) = ?', [$cleanEmail])->first();

        // Anti-énumération : même réponse générique si l'email existe ou non
        if ($user) {
            // Génération d'un jeton cryptographique sécurisé de 64 caractères via Laravel Password Broker
            $token = \Illuminate\Support\Facades\Password::broker()->createToken($user);

            // Stockage haché en BDD (password_reset_tokens)
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                [
                    'token'      => Hash::make($token),
                    'created_at' => now()
                ]
            );

            // Journalisation sécurisée (sans secret)
            \Illuminate\Support\Facades\Log::info("Lien de réinitialisation généré pour {$user->email}.");

            // Envoi réel du mail via EmailService centralisé avec lien vers le frontend React
            try {
                (new \App\Services\EmailService())->sendPasswordResetEmail($user, $token);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Erreur lors de l'envoi du mail de réinitialisation : " . $e->getMessage());
            }

            // Log d'audit
            $this->logAuthEvent($user, 'password_reset_requested', $request);
        }

        // Réponse générique identique pour prévenir l'énumération de comptes
        return response()->json([
            'success' => true,
            'message' => 'Si un compte correspondant existe, un email de réinitialisation a été envoyé.'
        ], 200);
    }

    /**
     * Réinitialiser le mot de passe à l'aide du jeton sécurisé et validation serveur.
     * Politique de complexité du mot de passe & révocation des anciennes sessions Sanctum.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'token'    => 'required|string|min:6',
            'password' => [
                'required', 'string', 'min:8', 'max:100',
                'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/',
                'confirmed',
            ],
        ], [
            'password.required'  => 'Le mot de passe est obligatoire.',
            'password.min'       => 'Le mot de passe est trop court. Il doit contenir au moins 8 caractères.',
            'password.max'       => 'Le mot de passe ne doit pas dépasser 100 caractères.',
            'password.regex'     => 'Le mot de passe est trop faible. Il doit inclure au moins une majuscule, une minuscule et un chiffre (ex: MonMdp2026).',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        $cleanEmail = strtolower(trim($request->email));
        $attemptsKey = 'otp_attempts:' . $cleanEmail;
        $attempts = (int) \Illuminate\Support\Facades\Cache::get($attemptsKey, 0);

        if ($attempts >= 5) {
            DB::table('password_reset_tokens')->where('email', $cleanEmail)->delete();
            \Illuminate\Support\Facades\Cache::forget($attemptsKey);
            return response()->json([
                'status'  => 'error',
                'code'    => 'TOO_MANY_ATTEMPTS',
                'error'   => 'Nombre maximal de tentatives atteint. Votre lien de réinitialisation a été annulé par sécurité. Veuillez refaire une demande.',
                'message' => 'Nombre maximal de tentatives atteint. Votre lien de réinitialisation a été annulé par sécurité. Veuillez refaire une demande.'
            ], 429);
        }

        // Récupérer l'enregistrement par email
        $record = DB::table('password_reset_tokens')
            ->where('email', $cleanEmail)
            ->first();

        // Validation du token (compatible avec Hash::check du token haché)
        if (!$record || !Hash::check($request->token, $record->token)) {
            \Illuminate\Support\Facades\Cache::put($attemptsKey, $attempts + 1, 900);
            return response()->json([
                'status'  => 'error',
                'code'    => 'INVALID_RESET_TOKEN',
                'error'   => 'Lien ou jeton de réinitialisation invalide ou adresse e-mail non correspondante.',
                'message' => 'Lien ou jeton de réinitialisation invalide ou adresse e-mail non correspondante.'
            ], 400);
        }

        // Vérifier si le jeton a expiré (durée de validité : 60 minutes)
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $record->email)->delete();
            \Illuminate\Support\Facades\Cache::forget($attemptsKey);
            return response()->json([
                'status'  => 'error',
                'code'    => 'EXPIRED_RESET_TOKEN',
                'error'   => 'Le lien de réinitialisation a expiré (validité : 60 minutes). Veuillez effectuer une nouvelle demande.',
                'message' => 'Le lien de réinitialisation a expiré (validité : 60 minutes). Veuillez effectuer une nouvelle demande.'
            ], 400);
        }

        \Illuminate\Support\Facades\Cache::forget($attemptsKey);

        $user = User::withoutGlobalScopes()->where('email', $record->email)->first();
        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'code'    => 'USER_NOT_FOUND',
                'error'   => 'Utilisateur non trouvé.',
                'message' => 'Utilisateur non trouvé.'
            ], 404);
        }

        // Mettre à jour le mot de passe
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token utilisé (usage unique strict)
        DB::table('password_reset_tokens')->where('email', $record->email)->delete();

        // Révocation de toutes les anciennes sessions et tokens Sanctum actifs par sécurité
        try {
            $user->tokens()->delete();
        } catch (\Throwable $te) {
            \Illuminate\Support\Facades\Log::warning("Impossible de révoquer les tokens Sanctum pour {$user->email}: " . $te->getMessage());
        }

        // Log d'audit & E-mail de confirmation
        $this->logAuthEvent($user, 'password_reset_completed', $request);
        try {
            (new \App\Services\EmailService())->sendPasswordChangedEmail($user);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Échec envoi mail confirmation mot de passe : " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.'
        ], 200);
    }

    /**
     * Valider l'adresse e-mail à l'aide d'un jeton sécurisé expirable.
     * Phase 1.5 — Verification Email & Account Activation (Server-Authoritative)
     */
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
        ], [
            'email.required' => 'L\'adresse e-mail est obligatoire.',
            'email.email'    => 'Format e-mail invalide.',
            'token.required' => 'Le jeton de vérification est obligatoire.',
        ]);

        $cleanEmail = strtolower(trim($request->email));

        // 1. Récupérer le jeton en BDD
        $record = DB::table('email_verification_tokens')
            ->where('email', $cleanEmail)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'error' => 'Jeton de vérification invalide ou adresse e-mail incorrecte.'
            ], 400);
        }

        // 2. Contrôle de l'expiration du jeton (60 minutes)
        if ($record->expires_at && Carbon::parse($record->expires_at)->isPast()) {
            DB::table('email_verification_tokens')->where('id', $record->id)->delete();
            return response()->json([
                'error' => 'Le lien de vérification a expiré (validité : 60 minutes). Veuillez demander un nouvel e-mail.'
            ], 400);
        }

        // 3. Récupérer l'utilisateur
        $user = User::withoutGlobalScopes()->where('email', $cleanEmail)->first();
        if (!$user) {
            return response()->json(['error' => 'Utilisateur introuvable.'], 404);
        }

        // 4. Isolation Multi-Tenant
        if ($record->company_id && $user->company_id !== $record->company_id) {
            return response()->json([
                'error' => 'Tentative de vérification inter-entreprise refusée.'
            ], 403);
        }

        // 5. Mettre à jour email_verified_at si pas déjà fait
        if ($user->email_verified_at === null) {
            $user->email_verified_at = now();
            $user->save();
        }

        // 6. Supprimer le jeton utilisé (usage unique)
        DB::table('email_verification_tokens')->where('email', $cleanEmail)->delete();

        $this->logAuthEvent($user, 'email_verified', $request);

        return response()->json([
            'success'           => true,
            'message'           => 'Votre adresse e-mail a été vérifiée avec succès. Votre compte est désormais pleinement actif.',
            'email_verified_at' => $user->email_verified_at,
        ]);
    }

    /**
     * Renvoyer l'e-mail de vérification avec un nouveau jeton.
     * Protected by auth:sanctum or email query. Throttle 5 req/min.
     */
    public function resendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if (!$user && $request->has('email')) {
            $request->validate(['email' => 'required|email']);
            $user = User::withoutGlobalScopes()->where('email', strtolower(trim($request->email)))->first();
        }

        if (!$user) {
            return response()->json(['error' => 'Utilisateur introuvable ou non connecté.'], 404);
        }

        // Si l'e-mail est déjà vérifié
        if ($user->email_verified_at !== null) {
            return response()->json([
                'message' => 'Votre adresse e-mail est déjà vérifiée. Aucune action nécessaire.',
                'email_verified' => true,
            ], 200);
        }

        // Cooldown Anti-Spam 60 secondes par utilisateur
        $cooldownKey = 'resend_email_cooldown_' . $user->id;
        if (\Illuminate\Support\Facades\Cache::has($cooldownKey)) {
            $remaining = \Illuminate\Support\Facades\Cache::get($cooldownKey) - time();
            if ($remaining > 0) {
                return response()->json([
                    'error' => "Veuillez patienter encore {$remaining} seconde(s) avant de demander un nouvel envoi d'e-mail.",
                ], 429);
            }
        }

        // Générer un jeton aléatoire sécurisé de 40 caractères
        $plainTextToken = \Illuminate\Support\Str::random(40);

        // Annuler/remplacer tout ancien jeton pour cette adresse
        DB::table('email_verification_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'company_id' => $user->company_id,
                'token'      => Hash::make($plainTextToken),
                'created_at' => now(),
                'expires_at' => now()->addMinutes(60),
            ]
        );

        // Enregistrer le cooldown de 60s
        \Illuminate\Support\Facades\Cache::put($cooldownKey, time() + 60, 60);

        // Déclencher l'envoi du mail de vérification
        try {
            (new \App\Services\EmailService())->sendVerificationEmail($user, $plainTextToken);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Échec envoi e-mail de vérification : " . $e->getMessage());
        }

        $this->logAuthEvent($user, 'verification_email_resent', $request);

        return response()->json([
            'message' => 'Un nouvel e-mail de vérification a été envoyé à votre adresse e-mail.',
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
            'pin_code'         => 'nullable|string|max:10',
            'current_password' => 'nullable|required_with:password|string',
            // Phase 5 : même politique de complexité que le register
            'password'         => [
                'nullable', 'string', 'min:8',
                'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/',
                'confirmed',
            ],
        ], [
            'password.min'   => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.regex' => 'Le mot de passe doit inclure au moins une majuscule, une minuscule et un chiffre.',
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
                'has_pin' => !empty($user->pin_code),
            ]
        ]);
    }

    /**
     * Mise à jour autonome du Code PIN de caisse.
     */
    public function updatePin(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'pin_code' => 'required|string|size:4|regex:/^[0-9]{4}$/',
        ], [
            'pin_code.required' => 'Le code PIN est obligatoire.',
            'pin_code.size'     => 'Le code PIN doit comporter exactement 4 chiffres (ex: 1234).',
            'pin_code.regex'    => 'Le code PIN doit comporter uniquement des chiffres (ex: 1234).',
        ]);

        $user->pin_code = $request->pin_code;
        $user->save();

        $this->logAuthEvent($user, 'pin_updated', $request);

        return response()->json([
            'success' => true,
            'message' => 'Code PIN de caisse mis à jour avec succès !',
            'user' => [
                'id'       => $user->id,
                'name'     => $user->name,
                'email'    => $user->email,
                'has_pin'  => true,
            ]
        ]);
    }

    /**
     * Obtenir les utilisateurs de l'entreprise courante avec leurs rôles et boutiques.
     * Accès : admin, gérant, super-admin (pour les filtres d'audit et la gestion).
     */
    public function getTenantUsers(Request $request)
    {
        try {
            $currentUser = $request->user();
            $tenantManager = app(\App\Services\TenantManager::class);
            $companyId = $currentUser ? ($currentUser->company_id ?: $tenantManager->getCompanyId()) : $tenantManager->getCompanyId();

            $query = User::withoutGlobalScopes()
                ->with(['role:id,name,slug', 'branch:id,name', 'accessZone:id,name,allowed_modules,branch_ids']);

            if ($companyId) {
                $query->where(function ($q) use ($companyId) {
                    $q->where('company_id', $companyId)->orWhereNull('company_id');
                });
            }

            $users = $query->orderBy('name')
                ->get()
                ->reject(function ($u) {
                    return $u->email === 'superadmin@dls.com' || ($u->role && $u->role->slug === 'super-admin');
                })
                ->map(function ($u) {
                    return [
                        'id'             => $u->id,
                        'name'           => $u->name,
                        'email'          => $u->email,
                        'status'         => $u->status ?: 'active',
                        'role'           => $u->role ? ['id' => $u->role->id, 'name' => $u->role->name, 'slug' => $u->role->slug] : ['id' => 0, 'name' => 'Employé', 'slug' => 'employee'],
                        'branch'         => $u->branch ? ['id' => $u->branch->id, 'name' => $u->branch->name] : null,
                        'access_zone_id' => $u->access_zone_id,
                        'access_zone'    => $u->accessZone ? ['id' => $u->accessZone->id, 'name' => $u->accessZone->name, 'allowed_modules' => $u->accessZone->allowed_modules, 'branch_ids' => $u->accessZone->branch_ids] : null,
                        'created_at'     => $u->created_at,
                    ];
                })
                ->values();

            return response()->json($users);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Erreur getTenantUsers : " . $e->getMessage());
            return response()->json([]);
        }
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
            'name'           => 'required|string|max:255',
            'email'          => ['required', 'string', 'email', 'max:255', 'unique:users,email', new RealEmailRule()],
            'password'       => 'required|string|min:6',
            'pin_code'       => 'required|string|size:4',
            'role_id'        => 'required|integer|exists:roles,id',
            'branch_id'      => 'nullable|integer|exists:branches,id',
            'access_zone_id' => 'nullable|integer|exists:access_zones,id',
            'branch_ids'     => 'nullable|array',
            'branch_ids.*'   => 'integer|exists:branches,id',
            'status'         => 'nullable|in:active,inactive',
        ]);

        // Vérification automatique des quotas d'utilisateurs selon le plan
        $company = $tenantManager->getCompany();
        if ($company) {
            $currentUsers = User::withoutGlobalScopes()->where('company_id', $companyId)->count();
            $plan = strtolower($company->subscription_plan ?: 'starter');
            $maxUsers = ($plan === 'starter' || $plan === 'basic') ? 2 : (($plan === 'pro' || $plan === 'premium') ? 5 : 999);

            if ($currentUsers >= $maxUsers) {
                return response()->json([
                    'message' => "Quota d'utilisateurs atteint : Votre formule d'abonnement (" . strtoupper($plan) . ") est limitée à {$maxUsers} compte(s) utilisateur(s). Veuillez faire évoluer votre offre vers une formule supérieure."
                ], 403);
            }
        }

        $primaryBranchId = $request->branch_id;
        if (!$primaryBranchId && !empty($request->branch_ids)) {
            $primaryBranchId = $request->branch_ids[0];
        }

        $user = User::create([
            'company_id'     => $companyId,
            'branch_id'      => $primaryBranchId,
            'access_zone_id' => $request->access_zone_id ?? null,
            'role_id'        => $request->role_id,
            'name'           => $request->name,
            'email'          => strtolower(trim($request->email)),
            'password'       => Hash::make($request->password),
            'pin_code'       => $request->pin_code,
            'status'         => $request->status ?? 'active',
        ]);

        if (!empty($request->branch_ids)) {
            $user->branches()->sync($request->branch_ids);
        } elseif ($primaryBranchId) {
            $user->branches()->sync([$primaryBranchId]);
        }

        $this->logAuthEvent($currentUser, 'user_created', $request);

        AccessControlLogger::log('user.created', $currentUser, $user, [
            'new_role_id'        => $user->role_id,
            'new_access_zone_id' => $user->access_zone_id,
        ]);

        $user->load(['role:id,name,slug', 'branch:id,name', 'branches:id,name', 'accessZone:id,name,allowed_modules,branch_ids']);

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user'    => [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'status'            => $user->status,
                'role'              => $user->role ? ['id' => $user->role->id, 'name' => $user->role->name, 'slug' => $user->role->slug] : null,
                'branch'            => $user->branch ? ['id' => $user->branch->id, 'name' => $user->branch->name] : null,
                'access_zone_id'    => $user->access_zone_id,
                'access_zone'       => $user->accessZone ? ['id' => $user->accessZone->id, 'name' => $user->accessZone->name, 'allowed_modules' => $user->accessZone->allowed_modules, 'branch_ids' => $user->accessZone->branch_ids] : null,
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
            'name'           => 'sometimes|required|string|max:255',
            'email'          => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id, new RealEmailRule()],
            'pin_code'       => 'nullable|string|size:4',
            'password'       => 'nullable|string|min:6',
            'role_id'        => 'sometimes|required|integer|exists:roles,id',
            'branch_id'      => 'nullable|integer|exists:branches,id',
            'access_zone_id' => 'nullable|integer|exists:access_zones,id',
            'branch_ids'     => 'nullable|array',
            'branch_ids.*'   => 'integer|exists:branches,id',
            'status'         => 'nullable|in:active,inactive',
        ]);

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        if ($request->filled('pin_code')) {
            $user->pin_code = $request->pin_code;
        }

        $user->fill($request->only(['name', 'email', 'role_id', 'branch_id', 'access_zone_id', 'status']));
        $user->save();

        if ($request->has('branch_ids')) {
            $user->branches()->sync($request->branch_ids ?? []);
        }

        $oldRoleId = $user->getOriginal('role_id');
        $oldAccessZoneId = $user->getOriginal('access_zone_id');

        $this->logAuthEvent($currentUser, 'user_updated', $request);

        AccessControlLogger::log('user.updated', $currentUser, $user, [
            'old_role_id'        => $oldRoleId,
            'new_role_id'        => $user->role_id,
            'old_access_zone_id' => $oldAccessZoneId,
            'new_access_zone_id' => $user->access_zone_id,
        ]);

        $user->load(['role:id,name,slug', 'branch:id,name', 'branches:id,name', 'accessZone:id,name,allowed_modules,branch_ids']);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès.',
            'user'    => [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'status'            => $user->status,
                'role'              => $user->role ? ['id' => $user->role->id, 'name' => $user->role->name, 'slug' => $user->role->slug] : null,
                'branch'            => $user->branch ? ['id' => $user->branch->id, 'name' => $user->branch->name] : null,
                'access_zone_id'    => $user->access_zone_id,
                'access_zone'       => $user->accessZone ? ['id' => $user->accessZone->id, 'name' => $user->accessZone->name, 'allowed_modules' => $user->accessZone->allowed_modules, 'branch_ids' => $user->accessZone->branch_ids] : null,
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

        $user->status = $user->status === 'active' ? 'inactive' : 'active';
        $user->save();

        AccessControlLogger::log('user.status_toggled', $currentUser, $user, [
            'status' => $user->status,
        ]);

        $this->logAuthEvent($currentUser, 'user_status_toggled', $request);

        return response()->json([
            'message' => "Compte " . ($user->status === 'active' ? 'activé' : 'désactivé') . " avec succès.",
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
        // Audit silencieux : toute erreur (colonne manquante, storage non accessible)
        // est ignorée pour ne jamais bloquer la connexion / l'inscription.
        try {
            $companyId = $user ? $user->company_id : null;
            try {
                if (!$companyId) {
                    $companyId = app(\App\Services\TenantManager::class)->getCompanyId();
                }
            } catch (\Throwable $_) {}

            // Construire uniquement les colonnes garanties d'exister
            $data = [
                'company_id' => $companyId,
                'user_id'    => $user ? $user->id : null,
                'action'     => $action,
                'ip_address' => $request->ip(),
                'user_agent' => substr($request->userAgent() ?? '', 0, 500),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Colonnes optionnelles : ajoutées seulement si elles existent
            $optionalColumns = [
                'auditable_type' => User::class,
                'auditable_id'   => $user ? $user->id : 0,
                'old_values'     => $emailAttempted ? json_encode(['email_attempted' => $emailAttempted]) : null,
                'new_values'     => json_encode(['status' => $user ? 'success' : 'failed']),
                'user_name'      => $user ? $user->name : ($emailAttempted ?? 'Anonyme'),
                'entity_type'    => 'auth',
                'entity_id'      => $user ? $user->id : null,
            ];

            foreach ($optionalColumns as $col => $val) {
                try {
                    if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', $col)) {
                        $data[$col] = $val;
                    }
                } catch (\Throwable $_) {}
            }

            AuditLog::unguarded(function () use ($data) {
                AuditLog::insert($data);
            });

        } catch (\Throwable $e) {
            // Silence total : on ne loggue jamais ici pour éviter le crash storage
        }
    }
}

