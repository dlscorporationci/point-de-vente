<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Purchase;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Génère un rapport analytique complet filtrable par date et boutique.
     */
    public function summary(Request $request)
    {
        $user = $request->user();
        if ($user->role->slug !== 'admin' && $user->role->slug !== 'gerant') {
            return response()->json(['error' => 'Accès refusé. Autorisation insuffisante.'], 403);
        }

        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date'))->startOfDay() : Carbon::now()->startOfMonth();
        $endDate   = $request->input('end_date') ? Carbon::parse($request->input('end_date'))->endOfDay() : Carbon::now()->endOfDay();
        $branchId  = $request->input('branch_id') ?: $user->branch_id;

        // 1. Statistiques des ventes
        $salesQuery = Sale::where('company_id', $user->company_id)
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($branchId) {
            $salesQuery->where('branch_id', $branchId);
        }

        $salesCount    = $salesQuery->count();
        $totalTtc      = floatval($salesQuery->sum('total'));
        $totalTax      = floatval($salesQuery->sum('tax'));
        $totalDiscount = floatval($salesQuery->sum('discount'));
        $totalHt       = floatval($salesQuery->sum('subtotal'));

        // Ventes par méthode de paiement
        $paymentsBreakdown = $salesQuery->clone()
            ->select('payment_method', DB::raw('SUM(total) as total_amount'))
            ->groupBy('payment_method')
            ->get()
            ->pluck('total_amount', 'payment_method');

        // 2. Calcul du PAMP / Coût des marchandises vendues (COGS) & Marge brute
        // Récupérer tous les détails des ventes de la période pour calculer le COGS
        $saleDetailsQuery = SaleDetail::whereHas('sale', function($query) use ($user, $startDate, $endDate, $branchId) {
            $query->where('company_id', $user->company_id)
                  ->whereBetween('created_at', [$startDate, $endDate]);
            if ($branchId) {
                $query->where('branch_id', $branchId);
            }
        })->with('product');

        $totalCogs = 0;
        foreach ($saleDetailsQuery->get() as $detail) {
            // Utilise le cost_price (PAMP) actuel du produit
            $costPrice = floatval($detail->product->cost_price ?? 0);
            $totalCogs += $detail->quantity * $costPrice;
        }

        $netHtRevenue = max(0, $totalTtc - $totalTax);
        $margin       = max(0, $netHtRevenue - $totalCogs);
        $marginPercentage = $netHtRevenue > 0 ? round(($margin / $netHtRevenue) * 100, 2) : 0;

        // 3. Balance âgée fournisseurs (Basé sur les achats non payés)
        $purchasesQuery = Purchase::where('company_id', $user->company_id)
            ->where('total_amount', '>', DB::raw('amount_paid'));

        if ($branchId) {
            $purchasesQuery->where('branch_id', $branchId);
        }

        $agedBalance = [
            'days_0_30'  => 0,
            'days_31_60' => 0,
            'days_61_90' => 0,
            'days_90_plus' => 0,
            'total_debt' => 0,
        ];

        foreach ($purchasesQuery->get() as $purchase) {
            $age = Carbon::now()->diffInDays(Carbon::parse($purchase->created_at));
            $debt = floatval($purchase->total_amount - $purchase->amount_paid);

            $agedBalance['total_debt'] += $debt;

            if ($age <= 30) {
                $agedBalance['days_0_30'] += $debt;
            } elseif ($age <= 60) {
                $agedBalance['days_31_60'] += $debt;
            } elseif ($age <= 90) {
                $agedBalance['days_61_90'] += $debt;
            } else {
                $agedBalance['days_90_plus'] += $debt;
            }
        }

        // 4. Valorisation du stock actuel dans la boutique
        $stockValuation = DB::table('branch_products')
            ->join('products', 'branch_products.product_id', '=', 'products.id')
            ->where('branch_products.branch_id', $branchId)
            ->select(
                DB::raw('SUM(branch_products.quantity * products.cost_price) as cost_value'),
                DB::raw('SUM(branch_products.quantity * products.selling_price) as selling_value')
            )
            ->first();

        $stockValueCost    = floatval($stockValuation->cost_value ?? 0);
        $stockValueSelling = floatval($stockValuation->selling_value ?? 0);
        $potentialProfit   = max(0, $stockValueSelling - $stockValueCost);

        // 5. Top 5 produits les plus vendus
        $topProducts = SaleDetail::whereHas('sale', function($query) use ($user, $startDate, $endDate, $branchId) {
                $query->where('company_id', $user->company_id)
                      ->whereBetween('created_at', [$startDate, $endDate]);
                if ($branchId) {
                    $query->where('branch_id', $branchId);
                }
            })
            ->join('products', 'sale_details.product_id', '=', 'products.id')
            ->select(
                'products.name',
                DB::raw('SUM(sale_details.quantity) as qty_sold'),
                DB::raw('SUM(sale_details.total) as revenue_generated')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('qty_sold')
            ->limit(5)
            ->get();

        return response()->json([
            'meta' => [
                'start_date' => $startDate->toIso8601String(),
                'end_date'   => $endDate->toIso8601String(),
                'branch_id'  => $branchId,
            ],
            'sales' => [
                'count'     => $salesCount,
                'total_ttc' => $totalTtc,
                'total_ht'  => $totalHt,
                'tax'       => $totalTax,
                'discount'  => $totalDiscount,
                'breakdown' => [
                    'cash' => floatval($paymentsBreakdown['cash'] ?? 0),
                    'card' => floatval($paymentsBreakdown['card'] ?? 0),
                ]
            ],
            'margins' => [
                'revenue_ht'        => $netHtRevenue,
                'cogs'              => $totalCogs,
                'margin'            => $margin,
                'margin_percentage' => $marginPercentage,
            ],
            'aged_balance' => $agedBalance,
            'stock_valuation' => [
                'value_at_cost'    => $stockValueCost,
                'value_at_selling' => $stockValueSelling,
                'potential_profit' => $potentialProfit,
            ],
            'top_products' => $topProducts,
        ]);
    }
}
