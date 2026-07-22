<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\StockMovement;
use App\Models\BranchProduct;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    /**
     * Liste des mouvements de stock paginés.
     */
    public function movements(Request $request)
    {
        $query = StockMovement::with(['product', 'branch']);

        if ($request->has('product_id') && !empty($request->product_id)) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->has('branch_id') && !empty($request->branch_id)) {
            $query->where('branch_id', $request->branch_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(20));
    }

    /**
     * Liste l'état des stocks courants par produit et boutique.
     */
    public function currentStock(Request $request)
    {
        $query = BranchProduct::with(['product', 'branch']);

        if ($request->has('branch_id') && !empty($request->branch_id)) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->has('product_id') && !empty($request->product_id)) {
            $query->where('product_id', $request->product_id);
        }

        return response()->json($query->get());
    }

    /**
     * Effectue un ajustement manuel de stock (pertes, casse, inventaire correctif).
     */
    public function adjust(Request $request)
    {
        if (!$request->user()->hasPermission('products.update')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric', // négatif ou positif
            'description' => 'required|string|max:255',
        ]);

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        $result = DB::transaction(function () use ($validated, $companyId) {
            $branchProduct = BranchProduct::where('branch_id', $validated['branch_id'])
                ->where('product_id', $validated['product_id'])
                ->lockForUpdate()
                ->first();

            if (!$branchProduct) {
                $branchProduct = BranchProduct::create([
                    'branch_id' => $validated['branch_id'],
                    'product_id' => $validated['product_id'],
                    'quantity' => 0.00
                ]);
            }

            // Vérifier que le stock résultant ne devienne pas négatif
            if ($branchProduct->quantity + $validated['quantity'] < 0) {
                throw new \Exception("Ajustement impossible : le stock de cette boutique ne peut pas devenir négatif.");
            }

            // Mettre à jour le stock
            $branchProduct->increment('quantity', $validated['quantity']);

            // Enregistrer le mouvement
            $movement = StockMovement::create([
                'company_id' => $companyId,
                'branch_id' => $validated['branch_id'],
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'type' => 'adjustment',
                'description' => $validated['description'],
            ]);

            return $branchProduct->load(['product', 'branch']);
        });

        return response()->json([
            'message' => 'Ajustement de stock enregistré avec succès.',
            'stock' => $result
        ], 200);
    }
}
