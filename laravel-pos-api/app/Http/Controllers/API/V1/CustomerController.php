<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    /**
     * Liste des clients avec recherche et pagination.
     */
    /**
     * Liste des clients avec recherche, filtrage par boutique active (Double Scénario) et pagination.
     */
    public function index(Request $request)
    {
        $query = Customer::with(['branch', 'branches']);

        $branchId = $request->input('branch_id');
        if (empty($branchId) || $branchId === 'undefined') {
            $branchId = app(\App\Services\TenantManager::class)->getBranchId();
        }

        if ($branchId && $branchId !== 'all') {
            $query->where(function($q) use ($branchId) {
                // Scenario A: Client affecté dans la table pivot customer_branches
                $q->whereHas('branches', function($b) use ($branchId) {
                    $b->where('branches.id', $branchId);
                })
                // Scenario B: Client local avec branch_id direct
                ->orWhere('customers.branch_id', $branchId)
                // Scenario C: Client global (sans branch_id direct et sans pivot)
                ->orWhere(function($subQ) {
                    $subQ->whereNull('customers.branch_id')->whereDoesntHave('branches');
                });
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
     * Création d'un client.
     */
    public function store(Request $request)
    {
        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();
        $activeBranchId = app(\App\Services\TenantManager::class)->getBranchId();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'nullable|email|max:100',
            'phone' => [
                'nullable',
                'string',
                'max:30',
                Rule::unique('customers')->where('company_id', $companyId)
            ],
            'address' => 'nullable|string|max:255',
            'credit_limit' => 'nullable|numeric|min:0',
            'debt_balance' => 'nullable|numeric|min:0',
            'loyalty_points' => 'nullable|integer|min:0',
            'branch_id' => 'nullable|exists:branches,id',
            'is_global' => 'nullable|boolean',
            'branch_ids' => 'nullable|array',
            'branch_ids.*' => 'exists:branches,id',
        ]);

        $isGlobal = $request->boolean('is_global');
        $branchIds = $request->input('branch_ids');
        unset($validated['is_global'], $validated['branch_ids']);

        if (!$isGlobal && empty($validated['branch_id']) && empty($branchIds) && $activeBranchId) {
            $validated['branch_id'] = $activeBranchId;
        } elseif ($isGlobal) {
            $validated['branch_id'] = null;
        }

        $customer = Customer::create($validated);

        if (!$isGlobal && !empty($branchIds) && is_array($branchIds)) {
            $customer->branches()->sync($branchIds);
        }

        return response()->json([
            'message' => 'Client créé avec succès.',
            'customer' => $customer->load(['branch', 'branches'])
        ], 201);
    }

    /**
     * Détails d'un client.
     */
    public function show(string $id)
    {
        $customer = Customer::with(['branch', 'branches', 'sales.details.product', 'sales.user', 'sales.branch'])->findOrFail($id);
        return response()->json($customer);
    }

    /**
     * Modification d'un client.
     */
    public function update(Request $request, string $id)
    {
        $customer = Customer::findOrFail($id);
        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'nullable|email|max:100',
            'phone' => [
                'nullable',
                'string',
                'max:30',
                Rule::unique('customers')->where('company_id', $companyId)->ignore($customer->id)
            ],
            'address' => 'nullable|string|max:255',
            'credit_limit' => 'nullable|numeric|min:0',
            'debt_balance' => 'nullable|numeric|min:0',
            'loyalty_points' => 'nullable|integer|min:0',
            'branch_id' => 'nullable|exists:branches,id',
            'is_global' => 'nullable|boolean',
            'branch_ids' => 'nullable|array',
            'branch_ids.*' => 'exists:branches,id',
        ]);

        $isGlobal = $request->boolean('is_global');
        $branchIds = $request->input('branch_ids');
        unset($validated['is_global'], $validated['branch_ids']);

        if ($isGlobal) {
            $validated['branch_id'] = null;
        }

        $customer->update($validated);

        if ($isGlobal) {
            $customer->branches()->detach();
        } elseif ($request->has('branch_ids')) {
            $customer->branches()->sync($branchIds ?: []);
        }

        return response()->json([
            'message' => 'Client mis à jour avec succès.',
            'customer' => $customer->load(['branch', 'branches'])
        ]);
    }

    /**
     * Suppression d'un client.
     */
    public function destroy(Request $request, string $id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json(['message' => 'Client supprimé avec succès.']);
    }
}
