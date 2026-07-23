<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\StockTransfer;
use App\Models\StockTransferDetail;
use App\Models\BranchProduct;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class TransferController extends Controller
{
    /**
     * Liste des transferts inter-boutiques.
     */
    public function index(Request $request)
    {
        $query = StockTransfer::with(['fromBranch', 'toBranch', 'details.product']);

        $branchId = $request->input('branch_id');
        if (empty($branchId) || $branchId === 'undefined') {
            $branchId = app(\App\Services\TenantManager::class)->getBranchId() ?: $request->header('X-Branch-ID');
        }

        if ($branchId && $branchId !== 'all') {
            $query->where(function($q) use ($branchId) {
                $q->where('from_branch_id', $branchId)
                  ->orWhere('to_branch_id', $branchId);
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    /**
     * Création d'une demande de transfert (Status: pending).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_branch_id' => 'required|exists:branches,id',
            'to_branch_id' => 'required|exists:branches,id|different:from_branch_id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
        ]);

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        $transfer = DB::transaction(function () use ($validated, $companyId) {
            $transferNumber = 'TRSF-' . time() . '-' . rand(100, 999);

            $transfer = StockTransfer::create([
                'company_id' => $companyId,
                'from_branch_id' => $validated['from_branch_id'],
                'to_branch_id' => $validated['to_branch_id'],
                'transfer_number' => $transferNumber,
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                StockTransferDetail::create([
                    'stock_transfer_id' => $transfer->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            return $transfer;
        });

        return response()->json([
            'message' => 'Demande de transfert créée avec succès.',
            'transfer' => $transfer->load(['fromBranch', 'toBranch', 'details.product'])
        ], 201);
    }

    /**
     * Détails d'un transfert.
     */
    public function show(string $id)
    {
        $transfer = StockTransfer::with(['fromBranch', 'toBranch', 'details.product'])->findOrFail($id);
        return response()->json($transfer);
    }

    /**
     * Valider une demande de transfert (Passage de pending_approval -> approved ou pending -> approved).
     */
    public function approve(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('products.update')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $transfer = StockTransfer::findOrFail($id);
        if (!in_array($transfer->status, ['draft', 'pending', 'pending_approval'])) {
            return response()->json(['error' => "Ce transfert ne peut pas être validé (statut actuel : {$transfer->status})."], 422);
        }

        $transfer->update(['status' => 'approved']);

        \App\Services\NotificationService::send(
            $transfer->company_id,
            $transfer->from_branch_id,
            null,
            'transfer_approved',
            'Transfert de stock validé',
            "Le transfert {$transfer->transfer_number} a été validé et est prêt pour expédition."
        );

        return response()->json([
            'message' => 'Transfert de stock validé avec succès.',
            'transfer' => $transfer->load(['fromBranch', 'toBranch', 'details.product'])
        ]);
    }

    /**
     * Expédition du transfert : débite le stock d'origine et passe en statut "shipped" (ou "transit").
     */
    public function ship(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('products.update')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $transfer = StockTransfer::findOrFail($id);

        if (!in_array($transfer->status, ['pending', 'approved', 'pending_approval'])) {
            return response()->json(['error' => "Ce transfert ne peut plus être expédié (statut actuel : {$transfer->status})."], 422);
        }

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        try {
            DB::transaction(function () use ($transfer, $companyId) {
                foreach ($transfer->details as $detail) {
                    $branchProduct = BranchProduct::where('branch_id', $transfer->from_branch_id)
                        ->where('product_id', $detail->product_id)
                        ->first();

                    if (!$branchProduct || $branchProduct->quantity < $detail->quantity) {
                        $productName = $detail->product->name;
                        throw new \Exception("Stock insuffisant pour le produit \"{$productName}\" dans la boutique d'origine (Stock disponible: " . ($branchProduct ? $branchProduct->quantity : 0) . ").");
                    }

                    // Débiter le stock d'origine
                    $branchProduct->decrement('quantity', $detail->quantity);

                    // Journaliser la sortie de transfert
                    StockMovement::create([
                        'company_id' => $companyId,
                        'branch_id' => $transfer->from_branch_id,
                        'product_id' => $detail->product_id,
                        'quantity' => -$detail->quantity,
                        'type' => 'transfer',
                        'reference_id' => $transfer->id,
                        'description' => "Sortie transfert inter-boutique #{$transfer->id}",
                    ]);
                }

                $transfer->update(['status' => 'shipped']);

                \App\Services\NotificationService::send(
                    $companyId,
                    $transfer->to_branch_id,
                    null,
                    'transfer_shipped',
                    'Transfert de stock expédié',
                    "Un transfert de stock {$transfer->transfer_number} a été expédié vers votre boutique."
                );
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Transfert expédié avec succès (marchandises en transit).',
            'transfer' => $transfer->load(['fromBranch', 'toBranch', 'details.product'])
        ]);
    }

    /**
     * Réception et validation du transfert : crédite le stock de destination et passe en statut "received" (ou "completed").
     */
    public function receive(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('products.update')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $transfer = StockTransfer::findOrFail($id);

        if (!in_array($transfer->status, ['shipped', 'transit'])) {
            return response()->json(['error' => 'Ce transfert ne peut pas être réceptionné (statut actuel : ' . $transfer->status . ').'], 422);
        }

        $user = $request->user();
        $userRole = is_object($user->role) ? $user->role->slug : $user->role;
        $isAdmin = in_array($userRole, ['super-admin', 'admin']);
        
        if (!$isAdmin && !$user->hasAccessToBranch($transfer->to_branch_id)) {
            return response()->json([
                'error' => 'Seul un membre de la boutique de destination peut confirmer la réception de ce transfert.'
            ], 403);
        }

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();

        DB::transaction(function () use ($transfer, $companyId) {
            foreach ($transfer->details as $detail) {
                $branchProduct = BranchProduct::firstOrCreate(
                    [
                        'branch_id' => $transfer->to_branch_id,
                        'product_id' => $detail->product_id
                    ],
                    ['quantity' => 0.00]
                );
                
                $branchProduct->increment('quantity', $detail->quantity);

                StockMovement::create([
                    'company_id' => $companyId,
                    'branch_id' => $transfer->to_branch_id,
                    'product_id' => $detail->product_id,
                    'quantity' => $detail->quantity,
                    'type' => 'transfer',
                    'reference_id' => $transfer->id,
                    'description' => "Entrée transfert inter-boutique #{$transfer->id}",
                ]);
            }

            $transfer->update(['status' => 'received']);

            \App\Services\NotificationService::send(
                $companyId,
                $transfer->from_branch_id,
                null,
                'transfer_received',
                'Transfert de stock réceptionné',
                "Le transfert {$transfer->transfer_number} a été réceptionné par la boutique de destination."
            );
        });

        return response()->json([
            'message' => 'Transfert réceptionné avec succès et stock crédité.',
            'transfer' => $transfer->load(['fromBranch', 'toBranch', 'details.product'])
        ]);
    }

    /**
     * Refuser un transfert.
     */
    public function reject(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('products.update')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $transfer = StockTransfer::findOrFail($id);

        if (in_array($transfer->status, ['received', 'completed', 'cancelled', 'rejected'])) {
            return response()->json(['error' => "Ce transfert ne peut pas être refusé dans son statut actuel ({$transfer->status})."], 422);
        }

        // Si déjà expédié, ré-incrémenter le stock de la boutique d'origine
        if (in_array($transfer->status, ['shipped', 'transit'])) {
            DB::transaction(function () use ($transfer) {
                foreach ($transfer->details as $detail) {
                    $bp = BranchProduct::firstOrCreate(
                        ['branch_id' => $transfer->from_branch_id, 'product_id' => $detail->product_id],
                        ['quantity' => 0.00]
                    );
                    $bp->increment('quantity', $detail->quantity);
                }
            });
        }

        $transfer->update(['status' => 'rejected']);

        \App\Services\NotificationService::send(
            $transfer->company_id,
            $transfer->from_branch_id,
            null,
            'transfer_rejected',
            'Transfert de stock refusé',
            "Le transfert {$transfer->transfer_number} a été refusé par la boutique de destination."
        );

        return response()->json([
            'message' => 'Transfert de stock refusé.',
            'transfer' => $transfer->load(['fromBranch', 'toBranch', 'details.product'])
        ]);
    }

    /**
     * Annuler un transfert.
     */
    public function cancel(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('products.update')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $transfer = StockTransfer::findOrFail($id);

        if (in_array($transfer->status, ['received', 'completed', 'cancelled'])) {
            return response()->json(['error' => "Ce transfert ne peut plus être annulé."], 422);
        }

        if (in_array($transfer->status, ['shipped', 'transit'])) {
            DB::transaction(function () use ($transfer) {
                foreach ($transfer->details as $detail) {
                    $bp = BranchProduct::firstOrCreate(
                        ['branch_id' => $transfer->from_branch_id, 'product_id' => $detail->product_id],
                        ['quantity' => 0.00]
                    );
                    $bp->increment('quantity', $detail->quantity);
                }
            });
        }

        $transfer->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Transfert de stock annulé.',
            'transfer' => $transfer->load(['fromBranch', 'toBranch', 'details.product'])
        ]);
    }
}
