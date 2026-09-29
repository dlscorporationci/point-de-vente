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
    public function store(Request $request)
    {
        $rules = [
            'name'    => ['required', 'string', 'min:2', 'max:100', 'regex:/[\pL\pN]/u'],
            'address' => 'nullable|string|min:3|max:255',
            'phone'   => ['nullable', 'string', 'max:30', 'regex:/^[\+\d\s\(\)\-\.]{8,30}$/'],
        ];

        $messages = [
            'name.required' => 'Le nom de la boutique est obligatoire.',
            'name.min'      => 'Le nom de la boutique doit comporter au moins 2 caractères.',
            'name.regex'    => 'Le nom de la boutique doit contenir des lettres ou chiffres valides.',
            'phone.regex'   => 'Le numéro de téléphone est invalide. Il doit comporter au moins 8 chiffres et ne contenir aucun caractère alphabétique.',
            'address.min'   => 'L\'adresse de la boutique doit comporter au moins 3 caractères.',
        ];

        $request->validate($rules, $messages);

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
            'name'    => $request->name,
            'address' => $request->address,
            'phone'   => $request->phone,
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
    /**
     * Modifier une boutique existante.
     * Accès réservé aux rôles : admin, super-admin.
     */
    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);

        $rules = [
            'name'         => ['sometimes', 'required', 'string', 'min:2', 'max:100', 'regex:/[\pL\pN]/u'],
            'address'      => 'nullable|string|min:3|max:255',
            'phone'        => ['nullable', 'string', 'max:30', 'regex:/^[\+\d\s\(\)\-\.]{8,30}$/'],
            'type'         => 'nullable|in:store,warehouse',
            'is_warehouse' => 'nullable|boolean',
            'status'       => 'nullable|in:open,closed,maintenance,suspended,archived,active,inactive',
        ];

        $messages = [
            'name.required' => 'Le nom de la boutique est obligatoire.',
            'name.min'      => 'Le nom de la boutique doit comporter au moins 2 caractères.',
            'name.regex'    => 'Le nom de la boutique doit contenir des lettres ou chiffres valides.',
            'phone.regex'   => 'Le numéro de téléphone est invalide. Il doit comporter au moins 8 chiffres et ne contenir aucun caractère alphabétique.',
            'address.min'   => 'L\'adresse de la boutique doit comporter au moins 3 caractères.',
        ];

        $request->validate($rules, $messages);

        $data = $request->only(['name', 'address', 'phone', 'type', 'is_warehouse', 'settings']);
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
