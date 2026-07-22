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
    public function index(Request $request)
    {
        $query = Customer::query();

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
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            'message' => 'Client créé avec succès.',
            'customer' => $customer
        ], 201);
    }

    /**
     * Détails d'un client.
     */
    public function show(string $id)
    {
        $customer = Customer::with(['sales.details.product', 'sales.user', 'sales.branch'])->findOrFail($id);
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
        ]);

        $customer->update($validated);

        return response()->json([
            'message' => 'Client mis à jour avec succès.',
            'customer' => $customer
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
