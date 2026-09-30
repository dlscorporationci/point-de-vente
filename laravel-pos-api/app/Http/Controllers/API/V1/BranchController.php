<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Branch;
use App\Models\User;

class BranchController extends Controller
{
    /**
     * Liste toutes les boutiques (succursales) de l'entreprise courante.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        if ($currentUser && $currentUser->accessZone && !empty($currentUser->accessZone->branch_ids)) {
            $branches = $currentUser->assignedBranches();
        } else {
            $branches = Branch::withCount('users')->orderBy('name')->get();
        }

        return response()->json($branches);
    }

    /**
     * Créer une nouvelle boutique pour l'entreprise courante.
     * Accès réservé aux rôles : admin, super-admin.
     */
    /**
     * Valider les données d'entrée d'une boutique avec filtres anti-données factices / répétitives.
     */
    private function validateBranchInput(Request $request, bool $isUpdate = false): void
    {
        $rules = [
            'name' => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'min:3',
                'max:100',
                function ($attribute, $value, $fail) {
                    if (empty($value)) return;
                    $trimmed = trim($value);

                    if (mb_strlen($trimmed) < 3) {
                        $fail('Le nom de la boutique doit comporter au moins 3 caractères.');
                        return;
                    }

                    if (preg_match('/(.)\1{2,}/u', $trimmed)) {
                        $fail('Le nom de la boutique ne peut pas contenir de répétitions abusives de caractères (ex: "ffff").');
                        return;
                    }

                    preg_match_all('/[\pL]/u', $trimmed, $matches);
                    $uniqueLetters = array_unique(array_map('mb_strtolower', $matches[0] ?? []));
                    if (count($uniqueLetters) < 2) {
                        $fail('Le nom de la boutique doit comporter au moins 2 lettres distinctes et être un nom valide.');
                        return;
                    }

                    $gibberish = ['qwerty', 'asdfgh', 'zxcvbn', 'azerty', '123456', '000000'];
                    $lower = mb_strtolower($trimmed);
                    foreach ($gibberish as $g) {
                        if (str_contains($lower, $g)) {
                            $fail('Le nom de la boutique saisi est invalide.');
                            return;
                        }
                    }
                }
            ],
            'address' => [
                'nullable',
                'string',
                'min:4',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (empty($value)) return;
                    $trimmed = trim($value);

                    if (mb_strlen($trimmed) < 4) {
                        $fail("L'adresse de la boutique doit comporter au moins 4 caractères.");
                        return;
                    }

                    if (preg_match('/(.)\1{2,}/u', $trimmed)) {
                        $fail("L'adresse de la boutique ne peut pas contenir de répétitions abusives (ex: \"ffff\").");
                        return;
                    }

                    preg_match_all('/[\pL\pN]/u', $trimmed, $matches);
                    $uniqueChars = array_unique(array_map('mb_strtolower', $matches[0] ?? []));
                    if (count($uniqueChars) < 2) {
                        $fail("L'adresse saisie n'est pas valide.");
                        return;
                    }
                }
            ],
            'phone' => [
                'nullable',
                'string',
                'max:30',
                function ($attribute, $value, $fail) {
                    if (empty($value)) return;

                    if (preg_match('/[a-zA-Z]/', $value)) {
                        $fail('Le numéro de téléphone ne doit contenir aucune lettre alphabétique (ex: "ffffgghhhhhh").');
                        return;
                    }

                    $digits = preg_replace('/\D/', '', $value);
                    if (strlen($digits) < 8) {
                        $fail('Le numéro de téléphone doit comporter au moins 8 chiffres valides (ex: +225 07 00 00 00).');
                        return;
                    }
                }
            ],
            'type'         => 'nullable|in:store,warehouse',
            'is_warehouse' => 'nullable|boolean',
            'status'       => 'nullable|in:open,closed,maintenance,suspended,archived,active,inactive',
        ];

        $request->validate($rules);
    }

    /**
     * Créer une nouvelle boutique pour l'entreprise courante.
     * Accès réservé aux rôles : admin, super-admin.
     */
    public function store(Request $request)
    {
        $this->validateBranchInput($request, isUpdate: false);

        // Vérification automatique des quotas selon la formule souscrite
        $company = app(\App\Services\TenantManager::class)->getCompany();
        if ($company) {
            $currentBranches = Branch::count();
            $plan = strtolower($company->subscription_plan ?: 'starter');

            $maxBranches = match($plan) {
                'starter', 'basic', 'gratuit', 'free' => 1,
                'pro' => 5,
                'premium', 'enterprise' => 999,
                default => 1,
            };

            if ($currentBranches >= $maxBranches) {
                $errorMsg = "Quota de boutiques atteint : Votre formule d'abonnement (" . strtoupper($plan) . ") est limitée à {$maxBranches} boutique(s). Pour ajouter d'autres espaces de vente, veuillez faire évoluer votre offre vers la formule Pro ou Premium.";
                return response()->json([
                    'error'            => $errorMsg,
                    'message'          => $errorMsg,
                    'upgrade_required' => true,
                    'current_plan'     => strtoupper($plan),
                    'max_branches'     => $maxBranches,
                ], 403);
            }
        }

        // Le BelongsToTenant injecte automatiquement le company_id
        $branch = Branch::create([
            'name'    => trim($request->name),
            'address' => $request->address ? trim($request->address) : null,
            'phone'   => $request->phone ? trim($request->phone) : null,
        ]);

        return response()->json([
            'message' => 'Boutique créée avec succès.',
            'branch'  => $branch,
        ], 201);
    }

    /**
     * Modifier une boutique existante.
     * Accès réservé aux rôles : admin, super-admin.
     */
    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);

        $this->validateBranchInput($request, isUpdate: true);

        $data = $request->only(['name', 'address', 'phone', 'type', 'is_warehouse', 'settings']);
        if ($request->filled('name')) $data['name'] = trim($request->name);
        if ($request->filled('address')) $data['address'] = trim($request->address);
        if ($request->filled('phone')) $data['phone'] = trim($request->phone);

        if ($request->filled('status')) {
            $st = $request->status;
            if ($st === 'active') $st = 'open';
            if ($st === 'inactive') $st = 'closed';
            $data['status'] = $st;
        }

        $branch->update($data);

        return response()->json([
            'message' => 'Boutique mise à jour avec succès.',
            'branch'  => $branch->fresh(),
        ]);
    }

    /**
     * Activer ou désactiver une boutique (Basculement Open / Closed).
     * Accès réservé aux rôles : admin, super-admin.
     */
    public function toggleStatus(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);

        $currentStatus = $branch->status ?? 'open';
        $newStatus = in_array($currentStatus, ['open', 'active']) ? 'closed' : 'open';
        $branch->update(['status' => $newStatus]);

        return response()->json([
            'message' => "Statut de la boutique modifiée vers '" . ($newStatus === 'open' ? 'Ouverte' : 'Fermée') . "' avec succès.",
            'branch'  => $branch->fresh(),
        ]);
    }

    /**
     * Supprimer une boutique (seulement si aucun utilisateur actif n'y est rattaché).
     * Accès réservé aux rôles : admin, super-admin.
     */
    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);

        // Sécurité : vérifier que la boutique n'a pas d'utilisateurs actifs
        $activeUsers = User::where('branch_id', $id)->where('status', 'active')->count();
        if ($activeUsers > 0) {
            return response()->json([
                'error' => "Impossible de supprimer cette boutique : {$activeUsers} utilisateur(s) actif(s) y sont rattaché(s). Veuillez d'abord les déplacer ou les désactiver.",
            ], 422);
        }

        $branch->delete();

        return response()->json([
            'message' => 'Boutique supprimée avec succès.',
        ]);
    }
}
