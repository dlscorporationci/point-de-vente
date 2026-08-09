<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use App\Models\BranchProduct;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use App\Events\Stock\StockAdjusted;
use App\Events\Stock\StockLow;

class StockController extends Controller
{
    /**
     * Liste des mouvements de stock paginés.
     */
    public function movements(Request $request)
    {
        $query = StockMovement::whereHas('product')->with(['product', 'branch']);

        if ($request->has('product_id') && !empty($request->product_id)) {
            $query->where('product_id', $request->product_id);
        }

        $branchId = $request->input('branch_id');
        if (empty($branchId) || $branchId === 'undefined') {
            $branchId = $request->header('X-Branch-ID');
        }

        if ($branchId && $branchId !== 'all') {
            $query->where('branch_id', $branchId);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(20));
    }

    /**
     * Liste l'état des stocks courants par produit et boutique.
     */
    public function currentStock(Request $request)
    {
        $branchId = $request->input('branch_id');
        if (empty($branchId) || $branchId === 'undefined') {
            $branchId = app(\App\Services\TenantManager::class)->getBranchId() ?: $request->header('X-Branch-ID');
        }

        $query = BranchProduct::whereHas('product');

        if (\Illuminate\Support\Facades\Schema::hasColumn('branch_products', 'is_active')) {
            $query->where('is_active', true);
        }

        $query->with(['product.category', 'branch']);

        if ($branchId && $branchId !== 'all') {
            $query->where('branch_id', $branchId);
        }

        if ($request->has('product_id') && !empty($request->product_id)) {
            $query->where('product_id', $request->product_id);
        }

        return response()->json($query->get());
    }

    /**
     * Effectue un ajustement de stock à 3 modes (Ajout, Retrait, Correction d'inventaire).
     */
    public function adjust(Request $request)
    {
        if (!$request->user()->hasPermission('stock.adjust')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $validated = $request->validate([
            'branch_id'   => 'required|exists:branches,id',
            'product_id'  => 'required|exists:products,id',
            'type'        => 'required|in:addition,withdrawal,correction',
            'quantity'    => 'required|numeric|min:0', // Quantité ajoutée, retirée, ou nouvelle quantité comptée
            'reason_code' => 'required|in:counting_error,loss,breakage,theft,deteriorated,entry_error,other',
            'comment'     => 'nullable|string|max:500',
        ]);

        if ($validated['reason_code'] === 'other' && empty($validated['comment'])) {
            return response()->json(['error' => 'Le champ commentaire est obligatoire pour le motif "autre".'], 422);
        }

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId() ?: ($request->user() ? $request->user()->company_id : 1);

        $result = DB::transaction(function () use ($validated, $companyId, $request) {
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

            $prevQty = (float) $branchProduct->quantity;
            $qtyChange = 0.00;
            $newQty = 0.00;
            $type = $validated['type'];

            if ($type === 'addition') {
                $qtyChange = (float) $validated['quantity'];
                $newQty = $prevQty + $qtyChange;
            } elseif ($type === 'withdrawal') {
                $qtyChange = -1 * abs((float) $validated['quantity']);
                $newQty = $prevQty + $qtyChange;
                if ($newQty < 0) {
                    throw new \Exception("Retrait impossible : le stock disponible est insuffisant ({$prevQty}).");
                }
            } elseif ($type === 'correction') {
                $newQty = (float) $validated['quantity'];
                $qtyChange = $newQty - $prevQty;
            }

            // Mettre à jour le stock dans la table pivot
            $branchProduct->quantity = $newQty;
            $branchProduct->save();

            // Générer un UUID
            $uuid = (string) \Illuminate\Support\Str::uuid();

            // Créer l'enregistrement d'ajustement détaillé
            $adjustment = \App\Models\StockAdjustment::create([
                'uuid'              => $uuid,
                'company_id'         => $companyId,
                'branch_id'          => $validated['branch_id'],
                'product_id'         => $validated['product_id'],
                'user_id'            => $request->user()->id,
                'type'               => $type,
                'previous_quantity' => $prevQty,
                'quantity_change'   => $qtyChange,
                'new_quantity'       => $newQty,
                'reason_code'        => $validated['reason_code'],
                'comment'            => $validated['comment'] ?? null,
                'reference'          => 'ADJ-' . strtoupper(substr($uuid, 0, 8)),
            ]);

            // Consigner le mouvement de stock général
            StockMovement::create([
                'company_id'  => $companyId,
                'branch_id'   => $validated['branch_id'],
                'product_id'  => $validated['product_id'],
                'quantity'    => $qtyChange,
                'type'        => $type === 'correction' ? 'inventory_correction' : ($type === 'addition' ? 'adjustment_add' : 'adjustment_remove'),
                'description' => "[$type] Motif: {$validated['reason_code']} | Remarque: " . ($validated['comment'] ?? 'Aucun'),
            ]);

            // Enregistrer dans audit_logs
            try {
                \App\Models\AuditLog::create([
                    'company_id'  => $companyId,
                    'user_id'     => $request->user()->id,
                    'event'       => "stock_adjustment_$type",
                    'description' => "Ajustement de stock ($type) sur le produit #{$validated['product_id']}. Écart: {$qtyChange}, Nouveau stock: {$newQty}",
                    'ip_address'  => $request->ip(),
                ]);
            } catch (\Throwable $e) {}

            return [
                'branch_product' => $branchProduct->load(['product', 'branch']),
                'adjustment'     => $adjustment
            ];
        });

        try {
            $bp = $result['branch_product'];
            $pName = $bp->product ? $bp->product->name : "Produit #{$validated['product_id']}";
            event(new StockAdjusted(
                $companyId ?: $request->user()->company_id,
                $validated['branch_id'],
                $validated['product_id'],
                $pName,
                $result['adjustment']->quantity_change,
                $validated['comment'] ?? $validated['reason_code'],
                $request->user()
            ));

            if ($bp && $bp->product && $bp->product->alert_quantity !== null) {
                if (floatval($bp->quantity) <= floatval($bp->product->alert_quantity)) {
                    event(new StockLow(
                        $companyId ?: $request->user()->company_id,
                        $validated['branch_id'],
                        $bp->product->id,
                        $bp->product->name,
                        floatval($bp->quantity),
                        floatval($bp->product->alert_quantity)
                    ));
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('StockAdjusted event error: ' . $e->getMessage());
        }

        return response()->json([
            'message'    => 'Ajustement de stock enregistré avec succès.',
            'adjustment' => $result['adjustment'],
            'stock'      => $result['branch_product']
        ], 200);
    }
}
