<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\CashSession;
use App\Models\CashSessionTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    /**
     * Liste des ventes de la compagnie (filtrée par tenant) avec filtres.
     */
    public function index(Request $request)
    {
        $query = Sale::with(['details.product', 'user', 'branch', 'customer']);

        $branchId = $request->input('branch_id');
        if (empty($branchId) || $branchId === 'undefined') {
            $branchId = app(\App\Services\TenantManager::class)->getBranchId();
        }

        if ($branchId && $branchId !== 'all') {
            $query->where('branch_id', $branchId);
        }
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Filtre par statut de paiement
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Filtre par date (du … au …)
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Recherche par nom/téléphone client ou numéro de vente
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('sale_number', 'like', "%{$s}%")
                  ->orWhere('client_name', 'like', "%{$s}%")
                  ->orWhere('client_phone', 'like', "%{$s}%");
            });
        }

        $sales = $query->orderByDesc('created_at')->paginate(20);

        return response()->json($sales);
    }

    /**
     * Enregistrer une nouvelle vente depuis le terminal POS.
     *
     * - Calcule le sous-total, la TVA (18 %), la remise et le total.
     * - Décrémente le stock de chaque article vendu dans la boutique active.
     * - Enregistre une transaction de type "sale" dans la session de caisse ouverte.
     * - Génère un numéro de vente séquentiel unique par compagnie.
     */
    public function store(Request $request)
    {
        $request->validate([
            'cash_session_id' => 'required|exists:cash_sessions,id',
            'payment_method'  => 'required|in:cash,card,credit',
            'customer_id'     => 'nullable|exists:customers,id',
            'items'           => 'required|array|min:1',
            'items.*.product_id'    => 'required|exists:products,id',
            'items.*.quantity'      => 'required|numeric|min:0.01',
            'items.*.selling_price' => 'required|numeric|min:0',
            'items.*.discount'      => 'nullable|numeric|min:0',
            'global_discount'       => 'nullable|numeric|min:0',
            'amount_received'       => 'nullable|numeric|min:0',
            'client_name'           => 'nullable|string|max:255',
            'client_phone'          => 'nullable|string|max:50',
        ]);

        $user = $request->user();

        // Vérifier que la session de caisse est bien ouverte
        $session = CashSession::where('id', $request->cash_session_id)
            ->where('status', 'open')
            ->first();

        if (!$session) {
            return response()->json(['error' => 'La session de caisse n\'est pas ouverte.'], 422);
        }

        $customer = null;
        if ($request->customer_id) {
            $customer = \App\Models\Customer::find($request->customer_id);
        }

        // Récupérer les paramètres de TVA de l'entreprise
        $company = \App\Models\Company::find($user->company_id);
        $taxSettings = $company->tax_settings ?? ['tax_rate' => 18, 'enable_tax' => true];
        $enableTax = isset($taxSettings['enable_tax']) ? (bool)$taxSettings['enable_tax'] : true;
        $taxRatePercent = $enableTax ? floatval($taxSettings['tax_rate'] ?? 18) : 0;
        $taxFactor = $taxRatePercent / 100;

        // Calculer les totaux de simulation pour vérifier la limite de crédit
        $subtotalSim = 0;
        $itemDiscountsSim = 0;
        foreach ($request->items as $item) {
            $subtotalSim += floatval($item['quantity']) * floatval($item['selling_price']);
            $itemDiscountsSim += floatval($item['discount'] ?? 0);
        }
        $totalDiscountSim = $itemDiscountsSim + floatval($request->global_discount ?? 0);
        $netSubtotalSim   = max(0, $subtotalSim - $totalDiscountSim);
        $taxSim           = round($netSubtotalSim * $taxFactor, 2);
        $totalSim         = round($netSubtotalSim + $taxSim, 2);

        if ($request->payment_method === 'credit') {
            if (!$customer) {
                return response()->json(['error' => 'Un client enregistré est requis pour une vente à crédit.'], 422);
            }
            $newDebt = $customer->debt_balance + $totalSim;
            if ($customer->credit_limit > 0 && $newDebt > $customer->credit_limit) {
                return response()->json([
                    'error' => "Le plafond de crédit du client est dépassé (Dette actuelle : {$customer->debt_balance} XOF, Nouveau total : {$newDebt} XOF, Plafond autorisé : {$customer->credit_limit} XOF)."
                ], 422);
            }
        }

        return DB::transaction(function () use ($request, $user, $session, $customer, $totalSim, $taxFactor) {
            // Calculer les totaux réels pour la transaction
            $subtotal = 0;
            $itemDiscounts = 0;
            $globalDiscount = floatval($request->global_discount ?? 0);
            $details = [];

            foreach ($request->items as $item) {
                $qty   = floatval($item['quantity']);
                $price = floatval($item['selling_price']);
                $disc  = floatval($item['discount'] ?? 0);

                $lineSubtotal = $qty * $price;
                $subtotal += $lineSubtotal;
                $itemDiscounts += $disc;

                // TVA par ligne selon les paramètres de l'entreprise
                $lineTax   = ($lineSubtotal - $disc) * $taxFactor;
                $lineTotal = ($lineSubtotal - $disc) + $lineTax;

                $details[] = [
                    'product_id'    => $item['product_id'],
                    'quantity'      => $qty,
                    'selling_price' => $price,
                    'discount'      => $disc,
                    'tax'           => round($lineTax, 2),
                    'total'         => round($lineTotal, 2),
                ];
            }

            $totalDiscount = $itemDiscounts + $globalDiscount;
            $netSubtotal   = max(0, $subtotal - $totalDiscount);
            $tax           = round($netSubtotal * $taxFactor, 2);
            $total         = round($netSubtotal + $tax, 2);

            $amountReceived = floatval($request->amount_received ?? $total);
            $change = max(0, round($amountReceived - $total, 2));

            // Numéro de vente séquentiel
            $lastSale = Sale::where('company_id', $user->company_id)
                ->orderByDesc('id')
                ->first();
            $nextNum = $lastSale ? intval(substr($lastSale->sale_number, 4)) + 1 : 1;
            $saleNumber = 'VTE-' . str_pad($nextNum, 6, '0', STR_PAD_LEFT);

            $paymentStatus = 'paid';
            if ($request->payment_method === 'credit') {
                $paymentStatus = 'unpaid';
                $customer->update([
                    'debt_balance' => $customer->debt_balance + $total
                ]);
            }

            // Gérer les points de fidélité (1 point par 1000 XOF d'achat)
            if ($customer) {
                $points = floor($total / 1000);
                if ($points > 0) {
                    $customer->increment('loyalty_points', $points);
                }
            }

            // Créer la vente
            $sale = Sale::create([
                'company_id'      => $user->company_id,
                'branch_id'       => $user->branch_id,
                'user_id'         => $user->id,
                'cash_session_id' => $session->id,
                'customer_id'     => $customer ? $customer->id : null,
                'sale_number'     => $saleNumber,
                'client_name'     => $customer ? $customer->name : ($request->client_name ?? 'Client Comptant'),
                'client_phone'    => $customer ? $customer->phone : $request->client_phone,
                'subtotal'        => round($subtotal, 2),
                'discount'        => round($totalDiscount, 2),
                'tax'             => $tax,
                'total'           => $total,
                'payment_method'  => $request->payment_method,
                'payment_status'  => $paymentStatus,
                'amount_received' => $request->payment_method === 'credit' ? 0 : $amountReceived,
                'amount_change'   => $request->payment_method === 'credit' ? 0 : $change,
            ]);

            $activeBranchId = app(\App\Services\TenantManager::class)->getBranchId() ?: $user->branch_id;

            // Créer les détails et décrémenter le stock avec verrouillage pessimiste lockForUpdate()
            foreach ($details as $d) {
                $sale->details()->create($d);

                // Verrouiller la ligne de stock pour éviter les accès simultanés concourants
                $branchProduct = \App\Models\BranchProduct::where('branch_id', $activeBranchId)
                    ->where('product_id', $d['product_id'])
                    ->lockForUpdate()
                    ->first();

                $availableQty = $branchProduct ? floatval($branchProduct->quantity) : 0;
                if ($availableQty < $d['quantity']) {
                    $product = \App\Models\Product::find($d['product_id']);
                    $pName = $product ? $product->name : "ID {$d['product_id']}";
                    throw new \Exception("Stock insuffisant pour \"{$pName}\" dans cette boutique (Disponible: {$availableQty}, Demandé: {$d['quantity']}).");
                }

                $branchProduct->decrement('quantity', $d['quantity']);

                // Mouvement de stock de type "sale"
                DB::table('stock_movements')->insert([
                    'company_id'   => $user->company_id,
                    'branch_id'    => $activeBranchId,
                    'product_id'   => $d['product_id'],
                    'type'         => 'sale',
                    'quantity'     => -$d['quantity'],
                    'reference_id' => $sale->id,
                    'description'  => "Vente {$saleNumber} par {$user->name}",
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }

            // Enregistrer la transaction dans la session de caisse
            CashSessionTransaction::create([
                'cash_session_id' => $session->id,
                'type'            => 'deposit',
                'amount'          => $total,
                'description'     => "Vente {$saleNumber} ({$request->payment_method})",
            ]);

            $sale->load('details.product', 'user', 'branch');

            return response()->json([
                'message' => 'Vente enregistrée avec succès.',
                'sale'    => $sale,
            ], 201);
        });
    }

    /**
     * Afficher le détail d'une vente.
     */
    public function show($id)
    {
        $sale = Sale::with(['details.product', 'user', 'branch', 'customer'])->findOrFail($id);
        return response()->json($sale);
    }
}
