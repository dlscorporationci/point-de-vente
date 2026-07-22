<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\BranchProduct;
use App\Models\StockMovement;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    /**
     * Liste des approvisionnements avec pagination et filtres.
     */
    public function index(Request $request)
    {
        $query = Purchase::with(['branch', 'supplier']);

        if ($request->has('supplier_id') && !empty($request->supplier_id)) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    /**
     * Enregistrement d'un nouvel approvisionnement (Bon de commande ou Réception directe).
     */
    public function store(Request $request)
    {
        if (!$request->user()->hasPermission('products.create')) { // permission générique d'achat/produit
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'status' => 'required|in:draft,ordered,received,cancelled,pending',
            'payment_status' => 'required|in:unpaid,partially_paid,partial,paid',
            'amount_paid' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.cost_price' => 'required|numeric|min:0',
        ]);

        // Normalisation avec les ENUMs MySQL
        if ($validated['payment_status'] === 'partial') {
            $validated['payment_status'] = 'partially_paid';
        }
        if ($validated['status'] === 'pending') {
            $validated['status'] = 'ordered';
        }

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        // Récupération des réglages de TVA de l'entreprise
        $company = \App\Models\Company::find($companyId);
        $taxSettings = $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true];
        $enableTax = isset($taxSettings['enable_tax']) ? (bool)$taxSettings['enable_tax'] : true;
        
        if ($request->has('tax_rate')) {
            $taxRatePercent = floatval($request->tax_rate);
        } else {
            $taxRatePercent = $enableTax ? floatval($taxSettings['tax_rate'] ?? 18) : 0;
        }
        $taxFactor = $taxRatePercent / 100;

        $purchase = DB::transaction(function () use ($validated, $companyId, $request, $taxRatePercent, $taxFactor) {
            // 1. Calculer les totaux de l'achat
            $subtotal = 0;
            $taxAmount = 0;
            
            foreach ($validated['items'] as $item) {
                $itemSubtotal = $item['quantity'] * $item['cost_price'];
                $itemTax = $itemSubtotal * $taxFactor;
                
                $subtotal += $itemSubtotal;
                $taxAmount += $itemTax;
            }

            $totalAmount = $subtotal + $taxAmount;
            $amountPaid = $validated['amount_paid'] ?? 0;

            // 2. Créer l'enregistrement d'achat
            $purchaseNumber = 'BON-ACH-' . time() . '-' . rand(100, 999);

            $purchase = Purchase::create([
                'company_id' => $companyId,
                'branch_id' => $validated['branch_id'],
                'supplier_id' => $validated['supplier_id'],
                'purchase_number' => $purchaseNumber,
                'status' => $validated['status'],
                'payment_status' => $validated['payment_status'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'amount_paid' => $amountPaid,
                'notes' => $validated['notes'] ?? null,
            ]);

            // 3. Créer les détails d'achat et déclencher la réception si 'received'
            foreach ($validated['items'] as $item) {
                $itemSubtotal = $item['quantity'] * $item['cost_price'];
                $itemTax = $itemSubtotal * $taxFactor;

                $detail = PurchaseDetail::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'quantity_received' => $validated['status'] === 'received' ? $item['quantity'] : 0,
                    'cost_price' => $item['cost_price'],
                    'tax_rate' => $taxRatePercent,
                    'tax_amount' => $itemTax,
                    'total_amount' => $itemSubtotal + $itemTax,
                ]);

                // Si déjà réceptionné, mettre à jour le stock et le PAMP
                if ($validated['status'] === 'received') {
                    $this->updateStockAndPamp(
                        $purchase->branch_id,
                        $item['product_id'],
                        $item['quantity'],
                        $item['cost_price'],
                        $purchase->id
                    );
                }
            }

            // 4. Mettre à jour le solde courant de dette du fournisseur
            // La dette augmente du total et diminue de ce que nous avons déjà payé
            if ($validated['status'] === 'received') {
                $debtIncrease = $totalAmount - $amountPaid;
                if ($debtIncrease > 0) {
                    $supplier = Supplier::findOrFail($validated['supplier_id']);
                    $supplier->increment('debt_balance', $debtIncrease);
                }
            }

            return $purchase;
        });

        return response()->json([
            'message' => 'Approvisionnement enregistré avec succès.',
            'purchase' => $purchase->load(['branch', 'supplier', 'details.product'])
        ], 201);
    }

    /**
     * Détails d'un approvisionnement.
     */
    public function show(string $id)
    {
        $purchase = Purchase::with(['branch', 'supplier', 'details.product'])->findOrFail($id);
        return response()->json($purchase);
    }

    /**
     * Réceptionner un bon de commande commandé (ordered)
     */
    public function receive(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('products.create')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $purchase = Purchase::findOrFail($id);

        if ($purchase->status === 'received') {
            return response()->json(['error' => 'Cette commande est déjà réceptionnée.'], 422);
        }

        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity_received' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($purchase, $validated) {
            foreach ($validated['items'] as $itemData) {
                $detail = PurchaseDetail::where('purchase_id', $purchase->id)
                    ->where('product_id', $itemData['product_id'])
                    ->firstOrFail();

                $qtyReceived = $itemData['quantity_received'];
                
                // Mettre à jour la ligne de détail
                $detail->update([
                    'quantity_received' => $qtyReceived
                ]);

                if ($qtyReceived > 0) {
                    $this->updateStockAndPamp(
                        $purchase->branch_id,
                        $detail->product_id,
                        $qtyReceived,
                        $detail->cost_price,
                        $purchase->id
                    );
                }
            }

            // Mettre à jour le statut du bon
            $purchase->update([
                'status' => 'received'
            ]);

            // Mettre à jour la dette du fournisseur
            $debtIncrease = $purchase->total_amount - $purchase->amount_paid;
            if ($debtIncrease > 0) {
                $supplier = Supplier::findOrFail($purchase->supplier_id);
                $supplier->increment('debt_balance', $debtIncrease);
            }
        });

        return response()->json([
            'message' => 'Commande réceptionnée et stocks mis à jour avec succès.',
            'purchase' => $purchase->load(['branch', 'supplier', 'details.product'])
        ]);
    }

    /**
     * Met à jour le stock par boutique, recalcule le PAMP produit, et journalise le mouvement.
     */
    private function updateStockAndPamp($branchId, $productId, $quantity, $costPrice, $purchaseId)
    {
        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        // 1. Recalculer le PAMP global du produit
        $product = Product::findOrFail($productId);
        
        // Quantité de stock totale de l'article avant cette réception
        $currentGlobalStock = BranchProduct::where('product_id', $productId)->sum('quantity');

        // Formule PAMP : (Stock global actuel * PAMP actuel) + (Nouvel achat * Prix d'achat) / (Stock global actuel + Nouvel achat)
        $oldStockValue = $currentGlobalStock * $product->cost_price;
        $newPurchaseValue = $quantity * $costPrice;
        $newTotalStock = $currentGlobalStock + $quantity;

        $newPamp = $newTotalStock > 0 
            ? ($oldStockValue + $newPurchaseValue) / $newTotalStock 
            : $costPrice;

        $product->update([
            'cost_price' => $newPamp
        ]);

        // 2. Mettre à jour le stock dans la boutique correspondante
        $branchProduct = BranchProduct::firstOrCreate(
            ['branch_id' => $branchId, 'product_id' => $productId],
            ['quantity' => 0.00]
        );
        $branchProduct->increment('quantity', $quantity);

        // 3. Journaliser le mouvement de stock
        StockMovement::create([
            'company_id' => $companyId,
            'branch_id' => $branchId,
            'product_id' => $productId,
            'quantity' => $quantity,
            'type' => 'purchase',
            'reference_id' => $purchaseId,
            'description' => "Réception achat Bon #{$purchaseId}",
        ]);
    }

    /**
     * Modification d'un approvisionnement (Statut de paiement, acompte, notes).
     */
    public function update(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('products.create')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $purchase = Purchase::findOrFail($id);

        $validated = $request->validate([
            'notes' => 'nullable|string',
            'payment_status' => 'nullable|in:unpaid,partially_paid,partial,paid',
            'amount_paid' => 'nullable|numeric|min:0',
        ]);

        if (isset($validated['payment_status']) && $validated['payment_status'] === 'partial') {
            $validated['payment_status'] = 'partially_paid';
        }

        $oldAmountPaid = floatval($purchase->amount_paid);

        $purchase->fill($request->only(['notes', 'payment_status', 'amount_paid']));
        $purchase->save();

        // Réajuster la dette du fournisseur si le montant payé a changé
        if ($request->has('amount_paid') && $purchase->status === 'received') {
            $newAmountPaid = floatval($purchase->amount_paid);
            $diff = $newAmountPaid - $oldAmountPaid;
            if ($diff != 0) {
                $supplier = Supplier::find($purchase->supplier_id);
                if ($supplier) {
                    $supplier->decrement('debt_balance', $diff);
                }
            }
        }

        return response()->json([
            'message' => 'Approvisionnement mis à jour avec succès.',
            'purchase' => $purchase->load(['branch', 'supplier', 'details.product'])
        ]);
    }
}
