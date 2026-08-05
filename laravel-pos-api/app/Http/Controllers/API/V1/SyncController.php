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
            if ($existingIdempotency) {
                $syncedUuids[] = $uuid;
                continue;
            }

            // Vérification de la validité des autorisations réseau lors de la re-connexion (Offline-First Authorization)
            $authService = app(\App\Services\AuthorizationService::class);
            if (!$authService->canAccessModule($user, $entityType) || !$authService->canAccessBranch($user, $branchId)) {
                DB::table('sync_idempotency')->insert([
                    'uuid'       => $uuid,
                    'company_id' => $companyId,
                    'status'     => 'authorization_rejected',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                \App\Services\AccessControlLogger::log('sync.authorization_rejected', $user, null, [
                    'uuid'        => $uuid,
                    'entity_type' => $entityType,
                    'action'      => $action,
                ]);

                $failed[] = [
                    'uuid'   => $uuid,
                    'status' => 'authorization_rejected',
                    'error'  => "Accès refusé lors de la synchronisation. Vos droits d'accès au module '{$entityType}' ou à la boutique ont été révoqués."
                ];
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

                        // Vérifier la limite de crédit si vente à crédit
                        $customerId = $payload['customer_id'] ?? null;
                        $paymentMethod = $payload['payment_method'] ?? 'cash';
                        $paymentStatus = $payload['payment_status'] ?? 'paid';

                        if ($customerId && ($paymentMethod === 'credit' || $paymentStatus === 'unpaid')) {
                            $customer = Customer::where('id', $customerId)
                                ->where('company_id', $companyId)
                                ->lockForUpdate()
                                ->first();

                            if ($customer) {
                                $currentDebt = floatval($customer->debt_balance ?? 0);
                                $creditLimit = floatval($customer->credit_limit ?? 0);
                                $newDebt = $currentDebt + $total;

                                if ($creditLimit > 0 && $newDebt > $creditLimit) {
                                    throw new \Exception("CONFLIT_CREDIT: Limite de crédit client dépassée pour \"{$customer->name}\" (Limite: {$creditLimit} FCFA, Dette actuelle: {$currentDebt} FCFA, Vente demandée: {$total} FCFA)");
                                }

                                $customer->increment('debt_balance', $total);
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
                            'customer_id' => $customerId,
                            'sale_number' => $saleNumber,
                            'payment_method' => $paymentMethod,
                            'payment_status' => $paymentStatus,
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

                    // --- TRANSFERTS INTER-BOUTIQUES HORS-LIGNE ---
                    else if ($entityType === 'transfer') {
                        $fromBranchId = $payload['from_branch_id'] ?? $branchId;
                        $toBranchId = $payload['to_branch_id'] ?? null;
                        $tItems = $payload['items'] ?? [];

                        if ($action === 'create') {
                            $transferNumber = 'TRSF-' . time() . '-' . rand(100, 999);
                            $transfer = StockTransfer::create([
                                'company_id' => $companyId,
                                'from_branch_id' => $fromBranchId,
                                'to_branch_id' => $toBranchId,
                                'transfer_number' => $transferNumber,
                                'status' => 'pending',
                                'notes' => $payload['notes'] ?? 'Transfert initié hors-ligne',
                            ]);

                            foreach ($tItems as $tItem) {
                                DB::table('stock_transfer_details')->insert([
                                    'stock_transfer_id' => $transfer->id,
                                    'product_id' => $tItem['product_id'],
                                    'quantity' => floatval($tItem['quantity']),
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ]);
                            }
                        } else if ($action === 'ship') {
                            $transferId = $payload['transfer_id'] ?? null;
                            $transfer = StockTransfer::where('id', $transferId)->where('company_id', $companyId)->first();

                            if ($transfer) {
                                $details = DB::table('stock_transfer_details')->where('stock_transfer_id', $transfer->id)->get();
                                foreach ($details as $detail) {
                                    $bp = BranchProduct::where('branch_id', $transfer->from_branch_id)
                                        ->where('product_id', $detail->product_id)
                                        ->lockForUpdate()
                                        ->first();

                                    $avail = $bp ? floatval($bp->quantity) : 0;
                                    if ($avail < floatval($detail->quantity)) {
                                        $prod = Product::find($detail->product_id);
                                        $pName = $prod ? $prod->name : "Produit #{$detail->product_id}";
                                        throw new \Exception("CONFLIT_TRANSFERT: Stock insuffisant dans la boutique d'origine pour expédier \"{$pName}\" (Disponible: {$avail}, Demandé: {$detail->quantity})");
                                    }
                                    $bp->decrement('quantity', floatval($detail->quantity));
                                }
                                $transfer->update(['status' => 'shipped']);
                            }
                        } else if ($action === 'receive') {
                            $transferId = $payload['transfer_id'] ?? null;
                            $transfer = StockTransfer::where('id', $transferId)->where('company_id', $companyId)->first();

                            if ($transfer && $transfer->status === 'shipped') {
                                $details = DB::table('stock_transfer_details')->where('stock_transfer_id', $transfer->id)->get();
                                foreach ($details as $detail) {
                                    $bp = BranchProduct::firstOrCreate([
                                        'branch_id' => $transfer->to_branch_id,
                                        'product_id' => $detail->product_id,
                                    ], [
                                        'quantity' => 0.00,
                                        'is_active' => true,
                                    ]);

                                    $bp = BranchProduct::where('id', $bp->id)->lockForUpdate()->first();
                                    $bp->increment('quantity', floatval($detail->quantity));
                                }
                                $transfer->update(['status' => 'received']);
                            }
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
                $msg = $e->getMessage();
                if (str_contains($msg, 'CONFLIT_STOCK') || str_contains($msg, 'CONFLIT_CREDIT') || str_contains($msg, 'CONFLIT_TRANSFERT')) {
                    $conflicts[] = [
                        'uuid' => $uuid,
                        'reason' => $msg,
                    ];
                } else {
                    $failed[] = [
                        'uuid' => $uuid,
                        'error' => $msg,
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

        // Notifications serveur ciblées
        $notifications = \App\Models\Notification::where('company_id', $companyId)
            ->where(function ($q) use ($branchId) {
                $q->where('branch_id', $branchId)->orWhereNull('branch_id');
            })
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)->orWhereNull('user_id');
            })
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        // Calcul du nouveau curseur déterministe généré par le serveur Laravel
        $nextCursor = null;
        if ($products->isNotEmpty()) {
            $lastProduct = $products->last();
            $nextCursor = $lastProduct->updated_at->toDateTimeString() . '|' . $lastProduct->id;
        } else {
            $nextCursor = $cursor;
        }

        // Rôles personnalisés, zones d'accès, règles métier et templates
        $roles = \App\Models\Role::whereNull('company_id')->orWhere('company_id', $companyId)->with('permissions:id,name,slug')->get();
        $accessZones = \App\Models\AccessZone::where('company_id', $companyId)->where('is_active', true)->get();
        $businessRules = \App\Models\BusinessRule::where('company_id', $companyId)->get();
        $catalogTemplates = \App\Models\CatalogTemplate::where('is_active', true)->withCount(['categories', 'products'])->get();

        return response()->json([
            'status'            => 'success',
            'next_cursor'       => $nextCursor,
            'products'          => $products,
            'categories'        => $categories,
            'customers'         => $customers,
            'stocks'            => $stocks,
            'notifications'     => $notifications,
            'roles'             => $roles,
            'access_zones'      => $accessZones,
            'business_rules'    => $businessRules,
            'catalog_templates' => $catalogTemplates,
            'synced_at'         => now()->toIso8601String(),
        ]);
    }
}
