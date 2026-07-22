<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\CashRegister;
use Illuminate\Http\Request;

class CashRegisterController extends Controller
{
    /**
     * Liste des caisses/terminaux de la boutique active ou filtrée.
     */
    public function index(Request $request)
    {
        $tenantManager = app(\App\Services\TenantManager::class);
        $branchId = $request->input('branch_id') ?: $tenantManager->getBranchId();

        $query = CashRegister::with('branch');
        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        return response()->json($query->orderBy('name')->get());
    }

    /**
     * Enregistrer une nouvelle caisse physique dans la boutique.
     */
    public function store(Request $request)
    {
        if (!$request->user()->hasPermission('cash-sessions.manage')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $tenantManager = app(\App\Services\TenantManager::class);
        $companyId = $tenantManager->getCompanyId();

        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name'      => 'required|string|max:100',
            'code'      => 'nullable|string|max:50',
            'status'    => 'nullable|in:active,inactive,maintenance',
        ]);

        $register = CashRegister::create([
            'company_id' => $companyId,
            'branch_id'  => $validated['branch_id'],
            'name'       => $validated['name'],
            'code'       => $validated['code'] ?? null,
            'status'     => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'message'  => 'Caisse physique créée avec succès.',
            'register' => $register->load('branch'),
        ], 201);
    }

    /**
     * Mettre à jour une caisse physique.
     */
    public function update(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('cash-sessions.manage')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $register = CashRegister::findOrFail($id);

        $validated = $request->validate([
            'name'   => 'sometimes|required|string|max:100',
            'code'   => 'nullable|string|max:50',
            'status' => 'sometimes|required|in:active,inactive,maintenance',
        ]);

        $register->update($validated);

        return response()->json([
            'message'  => 'Caisse mise à jour avec succès.',
            'register' => $register->load('branch'),
        ]);
    }

    /**
     * Supprimer une caisse physique.
     */
    public function destroy(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('cash-sessions.manage')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $register = CashRegister::findOrFail($id);
        $register->delete();

        return response()->json(['message' => 'Caisse supprimée avec succès.']);
    }
}
