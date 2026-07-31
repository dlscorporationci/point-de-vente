<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Product;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\CashSession;
use App\Models\StockMovement;
use App\Models\StockTransfer;
use App\Models\BranchProduct;

class SyncController extends Controller
{
    /**
     * Test de connectivité réelle (Health Check).
     */
    public function health(Request $request)
    {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'server_time' => now()->timestamp,
        ]);
    }

    /**
     * PUSH : Traitement par lot d'opérations hors-ligne avec Idempotence UUID.
     */
    public function push(Request $request)
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $request->validate([
            'operations' => 'required|array',
            'operations.*.uuid' => 'required|string|max:64',
            'operations.*.entity_type' => 'required|string',
            'operations.*.action' => 'required|string',
            'operations.*.payload' => 'required|array',
        ]);

        $syncedUuids = [];
        $conflicts = [];
        $failed = [];

        foreach ($request->input('operations', []) as $op) {
            $uuid = $op['uuid'];
            $entityType = $op['entity_type'];
            $action = $op['action'];
            $payload = $op['payload'];
            $branchId = $op['branch_id'] ?? $user->branch_id;

            // 1. Vérification d'Idempotence (Anti-Doublons)
            $existingIdempotency = DB::table('sync_idempotency')->where('uuid', $uuid)->first();
            if ($existingIdempotency) {
                $syncedUuids[] = $uuid;
                continue;
            }

            try {
                DB::transaction(function () use ($uuid, $entityType, $action, $payload, $companyId, $branchId, $user, &$syncedUuids, &$conflicts) {
                    
                    // --- VENTES HORS-LIGNE ---
                    if ($entityType === 'sale' && $action === 'create') {
                        // Récupérer la session de caisse active ou en créer une
                        $session = CashSession::where('user_id', $user->id)
                            ->where('status', 'open')
                            ->latest()
                            ->first();

                        if (!$session) {
                            $session = CashSession::create([
                                'company_id' => $companyId,
                                'branch_id' => $branchId,
                                'user_id' => $user->id,
                                'opening_balance' => 0,
                                'opened_at' => now(),
                                'status' => 'open'
                            ]);
                        }

                        // Vérifier le stock disponible pour chaque article (Lock for update)
                        // Vérifier le stock disponible pour chaque article (Lock for update)
                        $items = $payload['items'] ?? [];
                        foreach ($items as $item) {
                            $pId = $item['product_id'];
                            $qty = floatval($item['quantity']);

                            $bp = BranchProduct::firstOrCreate([
                                'branch_id' => $branchId,
                                'product_id' => $pId,
                            ], [
                                'quantity' => 0.00,
                                'is_active' => true,
                            ]);

                            $bp = BranchProduct::where('id', $bp->id)->lockForUpdate()->first();
                            $availQty = $bp ? floatval($bp->quantity) : 0;

                            if ($availQty < $qty) {
                                $prod = Product::find($pId);
                                $pName = $prod ? $prod->name : "Produit #{$pId}";
                                throw new \Exception("CONFLIT_STOCK: Stock insuffisant pour \"{$pName}\" (Disponible: {$availQty}, Demandé: {$qty})");
                            }
                        }

                        // Créer la vente
                        $subtotal = 0;
                        $itemDiscounts = 0;
                        $globalDiscount = floatval($payload['global_discount'] ?? 0);

                        foreach ($items as $it) {
                            $q = floatval($it['quantity']);
                            $p = floatval($it['selling_price']);
                            $d = floatval($it['discount'] ?? 0);
                            $subtotal += ($q * $p);
                            $itemDiscounts += $d;
                        }

                        $netSubtotal = max(0, $subtotal - ($itemDiscounts + $globalDiscount));
                        $tax = round($netSubtotal * 0.18, 2);
                        $total = round($netSubtotal + $tax, 2);

                        $saleNumber = 'VTE-' . strtoupper(substr(md5($uuid), 0, 8));

                        $sale = Sale::create([
                            'company_id' => $companyId,
                            'branch_id' => $branchId,
                            'cash_session_id' => $session->id,
                            'user_id' => $user->id,
                            'customer_id' => $payload['customer_id'] ?? null,
                            'sale_number' => $saleNumber,
                            'payment_method' => $payload['payment_method'] ?? 'cash',
                            'payment_status' => 'paid',
                            'amount_received' => floatval($payload['amount_received'] ?? $total),
                            'amount_change' => max(0, floatval($payload['amount_received'] ?? $total) - $total),
                            'subtotal' => $subtotal,
                            'discount' => $itemDiscounts + $globalDiscount,
                            'tax' => $tax,
                            'total' => $total,
                            'client_name' => $payload['client_name'] ?? 'Client Comptant',
                            'client_phone' => $payload['client_phone'] ?? null,
                        ]);

                        foreach ($items as $it) {
                            $q = floatval($it['quantity']);
                            $p = floatval($it['selling_price']);
                            $d = floatval($it['discount'] ?? 0);
                            $lTotal = ($q * $p) - $d;

                            SaleDetail::create([
                                'sale_id' => $sale->id,
                                'product_id' => $it['product_id'],
                                'quantity' => $q,
                                'selling_price' => $p,
                                'discount' => $d,
                                'total' => $lTotal,
                            ]);

                            // Décrémenter le stock serveur
                            $bp = BranchProduct::where('branch_id', $branchId)
                                ->where('product_id', $it['product_id'])
                                ->first();

                            if ($bp) {
                                $bp->decrement('quantity', $q);
                            }
                        }
                    }

                    // --- AJUSTEMENT DE STOCK HORS-LIGNE ---
                    else if ($entityType === 'stock' && $action === 'adjust') {
                        $pId = $payload['product_id'];
                        $qty = floatval($payload['quantity']);

                        $bp = BranchProduct::firstOrCreate([
                            'branch_id' => $branchId,
                            'product_id' => $pId,
                        ], [
                            'quantity' => 0.00,
                            'is_active' => true,
                        ]);

                        if ($bp) {
                            $bp->increment('quantity', $qty);
                            StockMovement::create([
                                'company_id' => $companyId,
                                'branch_id' => $branchId,
                                'product_id' => $pId,
                                'user_id' => $user->id,
                                'type' => 'adjustment',
                                'quantity' => $qty,
                                'reason' => $payload['reason'] ?? 'Ajustement hors-ligne',
                            ]);
                        }
                    }

                    // 2. Enregistrer la clé d'Idempotence dans la BDD serveur
                    DB::table('sync_idempotency')->insert([
                        'uuid' => $uuid,
                        'entity_type' => $entityType,
                        'company_id' => $companyId,
                        'branch_id' => $branchId,
                        'user_id' => $user->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $syncedUuids[] = $uuid;
                });
            } catch (\Exception $e) {
                if (str_contains($e->getMessage(), 'CONFLIT_STOCK')) {
                    $conflicts[] = [
                        'uuid' => $uuid,
                        'reason' => $e->getMessage(),
                    ];
                } else {
                    $failed[] = [
                        'uuid' => $uuid,
                        'error' => $e->getMessage(),
                    ];
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'synced_uuids' => $syncedUuids,
            'conflicts' => $conflicts,
            'failed' => $failed,
        ]);
    }

    /**
     * PULL : Récupération du delta incrémental avec curseur déterministe généré par Laravel (updated_at ASC, id ASC).
     */
    public function pull(Request $request)
    {
        $user = $request->user();
        $companyId = $user->company_id;
        $branchId = $request->input('branch_id') ?? app(\App\Services\TenantManager::class)->getBranchId() ?? $user->branch_id;

        $cursor = $request->input('cursor'); // Format: "YYYY-MM-DD HH:MM:SS|id"
        $cursorUpdatedAt = '1970-01-01 00:00:00';
        $cursorId = 0;

        if ($cursor && str_contains($cursor, '|')) {
            $parts = explode('|', $cursor);
            $cursorUpdatedAt = $parts[0];
            $cursorId = intval($parts[1] ?? 0);
        }

        // Produits avec Tombstones (deleted_at) et ordre déterministe
        $products = Product::withTrashed()
            ->where('company_id', $companyId)
            ->where(function ($q) use ($cursorUpdatedAt, $cursorId) {
                $q->where('updated_at', '>', $cursorUpdatedAt)
                  ->orWhere(function ($q2) use ($cursorUpdatedAt, $cursorId) {
                      $q2->where('updated_at', '=', $cursorUpdatedAt)
                         ->where('id', '>', $cursorId);
                  });
            })
            ->orderBy('updated_at', 'asc')
            ->orderBy('id', 'asc')
            ->limit(100)
            ->get();

        // Catégories
        $categories = Category::where('company_id', $companyId)->get();

        // Clients
        $customers = Customer::where('company_id', $companyId)->get();

        // Stocks de la boutique
        $stocks = BranchProduct::where('branch_id', $branchId)->get();

        // Calcul du nouveau curseur déterministe généré par le serveur Laravel
        $nextCursor = null;
        if ($products->isNotEmpty()) {
            $lastProduct = $products->last();
            $nextCursor = $lastProduct->updated_at->toDateTimeString() . '|' . $lastProduct->id;
        } else {
            $nextCursor = $cursor;
        }

        return response()->json([
            'next_cursor' => $nextCursor,
            'products' => $products,
            'categories' => $categories,
            'customers' => $customers,
            'stocks' => $stocks,
            'server_time' => now()->toIso8601String(),
        ]);
    }
}
