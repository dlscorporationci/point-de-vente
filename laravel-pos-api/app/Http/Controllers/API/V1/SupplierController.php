<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Supplier;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    /**
     * Liste des fournisseurs avec recherche et pagination.
     */
    /**
     * Liste des fournisseurs avec recherche, filtrage par boutique affectée et pagination.
     */
    public function index(Request $request)
    {
        $query = Supplier::with('branches');

        $branchId = $request->input('branch_id');
        if (empty($branchId) || $branchId === 'undefined') {
            $branchId = app(\App\Services\TenantManager::class)->getBranchId();
        }

        if ($branchId && $branchId !== 'all') {
            $query->where(function($q) use ($branchId) {
                $q->whereHas('branches', function($b) use ($branchId) {
                    $b->where('branches.id', $branchId);
                })->orDoesntHave('branches'); // Si aucun pivot n'est défini, le fournisseur est global à l'entreprise
            });
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('name')->paginate(15));
    }

    /**
     * Création d'un fournisseur (Restreint par permission).
     */
    public function store(Request $request)
    {
        if (!$request->user()->hasPermission('suppliers.create')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('suppliers')->where('company_id', $companyId)
            ],
            'email' => 'nullable|email|max:100',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'debt_balance' => 'nullable|numeric',
            'branch_ids' => 'nullable|array',
            'branch_ids.*' => 'exists:branches,id',
        ]);

        $branchIds = $request->input('branch_ids');
        unset($validated['branch_ids']);

        $supplier = Supplier::create($validated);

        if (!empty($branchIds) && is_array($branchIds)) {
            $supplier->branches()->sync($branchIds);
        }

        return response()->json([
            'message' => 'Fournisseur créé avec succès.',
            'supplier' => $supplier->load('branches')
        ], 201);
    }

    /**
     * Détails d'un fournisseur.
     */
    public function show(string $id)
    {
        $supplier = Supplier::with('branches')->findOrFail($id);
        return response()->json($supplier);
    }

    /**
     * Modification d'un fournisseur (Restreint par permission).
     */
    public function update(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('suppliers.update')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $supplier = Supplier::findOrFail($id);
        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('suppliers')->where('company_id', $companyId)->ignore($supplier->id)
            ],
            'email' => 'nullable|email|max:100',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'debt_balance' => 'nullable|numeric',
            'branch_ids' => 'nullable|array',
            'branch_ids.*' => 'exists:branches,id',
        ]);

        $branchIds = $request->input('branch_ids');
        unset($validated['branch_ids']);

        $supplier->update($validated);

        if ($request->has('branch_ids')) {
            $supplier->branches()->sync($branchIds ?: []);
        }

        return response()->json([
            'message' => 'Fournisseur mis à jour avec succès.',
            'supplier' => $supplier->load('branches')
        ]);
    }

    /**
     * Suppression d'un fournisseur (Restreint par permission).
     */
    public function destroy(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('suppliers.delete')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return response()->json(['message' => 'Fournisseur supprimé avec succès.']);
    }
}
