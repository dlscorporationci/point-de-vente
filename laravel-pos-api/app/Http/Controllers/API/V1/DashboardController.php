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
        try {
            $tenantManager = app(TenantManager::class);
            $user = $request->user();
            $companyId = $user ? ($user->company_id ?: $tenantManager->getCompanyId()) : $tenantManager->getCompanyId();
            $branchId = $request->header('X-Branch-ID') ?: ($tenantManager->getBranchId() ?: ($user ? $user->branch_id : null));

            $today = Carbon::today();

            $salesQuery = Sale::where('company_id', $companyId);
            if ($branchId) {
                $salesQuery->where('branch_id', $branchId);
            }

            $todaySales = (clone $salesQuery)
                ->whereDate('created_at', $today)
                ->whereIn('payment_status', ['paid', 'completed', 'partial']);

            $todayCa = (float) $todaySales->sum('total');
            $todaySalesCount = $todaySales->count();

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

            $pendingTransfersCount = 0;
            if ($branchId) {
                $pendingTransfersCount = StockTransfer::where('to_branch_id', $branchId)
                    ->whereIn('status', ['pending', 'approved', 'shipped'])
                    ->count();
            }

            $activeCashSession = null;
            if (\Illuminate\Support\Facades\Schema::hasTable('cash_sessions')) {
                $sessionQuery = CashSession::where('company_id', $companyId)->where('status', 'open');
                if ($branchId) {
                    $sessionQuery->where('branch_id', $branchId);
                }
                $currentSession = ($user ? $sessionQuery->where('user_id', $user->id)->first() : null) ?: $sessionQuery->first();

                if ($currentSession) {
                    $activeCashSession = [
                        'id'            => $currentSession->id,
                        'opened_at'     => $currentSession->opened_at,
                        'opening_amount'=> (float) $currentSession->opening_amount,
                        'current_total' => (float) ($currentSession->current_amount ?? $currentSession->opening_amount),
                        'register_name' => $currentSession->register ? $currentSession->register->name : 'Caisse Principale',
                    ];
                }
            }

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
                        'created_at'     => $s->created_at,
                        'user_name'      => $s->user ? $s->user->name : 'Opérateur',
                    ];
                });

            return response()->json([
                'today_ca'             => $todayCa,
                'today_transactions'   => $todaySalesCount,
                'total_products'       => $totalProductsCount,
                'stock_alerts'         => $lowStockCount,
                'incoming_transfers'   => $pendingTransfersCount,
                'cash_session'         => $activeCashSession,
                'recent_sales'         => $recentSales,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Erreur DashboardController@stats : " . $e->getMessage());
            return response()->json([
                'today_ca'           => 0,
                'today_transactions' => 0,
                'total_products'     => 0,
                'stock_alerts'       => 0,
                'incoming_transfers' => 0,
                'cash_session'       => null,
                'recent_sales'       => [],
            ]);
        }
    }
}
