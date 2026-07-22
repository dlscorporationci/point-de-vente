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
        $branches = Branch::withCount('users')->orderBy('name')->get();

        return response()->json($branches);
    }

    /**
     * Créer une nouvelle boutique pour l'entreprise courante.
     * Accès réservé aux rôles : admin, super-admin.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
            'phone'   => 'nullable|string|max:30',
        ]);

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

        $request->validate([
            'name'         => 'sometimes|required|string|max:100',
            'address'      => 'nullable|string|max:255',
            'phone'        => 'nullable|string|max:30',
            'type'         => 'nullable|in:store,warehouse',
            'is_warehouse' => 'nullable|boolean',
            'status'       => 'nullable|in:open,closed,maintenance,suspended,archived,active,inactive',
        ]);

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
