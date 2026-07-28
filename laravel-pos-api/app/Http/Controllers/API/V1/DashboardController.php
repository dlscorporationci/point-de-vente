<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Product;
use App\Models\BranchProduct;
use App\Models\StockTransfer;
use App\Models\CashSession;
use App\Services\TenantManager;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Obtenir les statistiques du tableau de bord contextualisées par la boutique active.
     */
    public function stats(Request $request)
    {
        $tenantManager = app(TenantManager::class);
        $user = $request->user();
        $companyId = $user->company_id ?: $tenantManager->getCompanyId();
        $branch = $tenantManager->getBranch();
        $branchId = $branch ? $branch->id : null;

        $today = Carbon::today();

        // 1. Chiffre d'Affaires & Ventes du jour
        $salesQuery = Sale::where('company_id', $companyId);
        if ($branchId) {
            $salesQuery->where('branch_id', $branchId);
        }

        $todaySales = (clone $salesQuery)
            ->whereDate('created_at', $today)
            ->where('payment_status', 'completed');

        $todayCa = (float) $todaySales->sum('total');
        $todaySalesCount = $todaySales->count();

        // 2. Alertes de Stock (Produits en rupture ou quantité <= alert_quantity)
        $lowStockCount = 0;
        $totalProductsCount = 0;

        if ($branchId) {
            $totalProductsCount = BranchProduct::where('branch_id', $branchId)->count();
            $lowStockCount = BranchProduct::join('products', 'branch_products.product_id', '=', 'products.id')
                ->where('branch_products.branch_id', $branchId)
                ->whereRaw('branch_products.quantity <= COALESCE(products.alert_quantity, 5)')
                ->count();
        } else {
            $totalProductsCount = Product::where('company_id', $companyId)->count();
            $lowStockCount = Product::where('company_id', $companyId)
                ->whereHas('branchProducts', function ($q) {
                    $q->whereRaw('branch_products.quantity <= COALESCE(products.alert_quantity, 5)');
                })
                ->count();
        }

        // 3. Transferts de stock en attente pour la boutique active
        $pendingTransfersCount = 0;
        if ($branchId) {
            $pendingTransfersCount = StockTransfer::where('to_branch_id', $branchId)
                ->whereIn('status', ['pending', 'approved', 'shipped'])
                ->count();
        }

        // 4. Session de Caisse active pour la boutique / utilisateur
        $activeCashSession = null;
        $sessionQuery = CashSession::where('company_id', $companyId)->where('status', 'open');
        if ($branchId) {
            $sessionQuery->where('branch_id', $branchId);
        }
        $currentSession = $sessionQuery->where('user_id', $user->id)->first() ?: $sessionQuery->first();

        if ($currentSession) {
            $activeCashSession = [
                'id'            => $currentSession->id,
                'opened_at'     => $currentSession->opened_at,
                'opening_amount'=> (float) $currentSession->opening_amount,
                'current_total' => (float) ($currentSession->current_amount ?? $currentSession->opening_amount),
                'register_name' => $currentSession->register ? $currentSession->register->name : 'Caisse Principale',
            ];
        }

        // 5. Dernières Ventes de la boutique active (5 dernières)
        $recentSales = (clone $salesQuery)
            ->with(['user:id,name', 'customer:id,name'])
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($s) {
                return [
                    'id'             => $s->id,
                    'sale_number'    => $s->sale_number,
                    'client_name'    => $s->client_name ?: ($s->customer ? $s->customer->name : 'Client de passage'),
                    'total'          => (float) $s->total,
                    'payment_method' => $s->payment_method,
                    'payment_status' => $s->payment_status,
                    'user_name'      => $s->user ? $s->user->name : 'Caissier',
                    'created_at'     => $s->created_at->toISOString(),
                ];
            });

        return response()->json([
            'branch' => $branch ? [
                'id' => $branch->id,
                'name' => $branch->name,
                'type' => $branch->type,
                'status' => $branch->status,
            ] : null,
            'stats' => [
                'today_ca'                => $todayCa,
                'today_sales_count'       => $todaySalesCount,
                'total_products_count'    => $totalProductsCount,
                'low_stock_count'         => $lowStockCount,
                'pending_transfers_count' => $pendingTransfersCount,
            ],
            'active_cash_session' => $activeCashSession,
            'recent_sales'        => $recentSales,
        ]);
    }
}
