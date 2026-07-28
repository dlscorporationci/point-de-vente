<?php

namespace App\Listeners;

use App\Events\Purchase\PurchaseCreated;
use App\Events\Purchase\PurchaseReceived;
use App\Services\NotificationService;

/**
 * Listener pour les événements d'achat/approvisionnement.
 * 
 * Logique :
 * - Achat créé : Admin + Gérant de la boutique (ont purchases.view)
 *   NE PAS notifier caissier (pas de droit purchases.view)
 * - Achat réceptionné : Admin + Gérant de la boutique (stock mis à jour)
 */
class NotifyPurchaseEvents
{
    public function handlePurchaseCreated(PurchaseCreated $event): void
    {
        $purchase  = $event->purchase;
        $actor     = $event->actor;
        $companyId = $purchase->company_id;
        $branchId  = $purchase->branch_id;

        $totalFormatted = number_format($purchase->total_amount ?? $purchase->total ?? 0, 0, ',', ' ');
        $supplierName   = $purchase->supplier ? $purchase->supplier->name : "Fournisseur #{$purchase->supplier_id}";

        NotificationService::notifyBranchUsers(
            companyId:          $companyId,
            branchId:           $branchId,
            targetRoles:        ['admin', 'gerant'],
            requiredPermission: 'purchases.view',
            type:               'purchase_created',
            title:              '📦 Nouvel achat',
            message:            "{$actor->name} a enregistré un achat #{$purchase->reference_number} de {$totalFormatted} XOF auprès de {$supplierName}.",
            priority:           'info',
            data:               [
                'purchase_id' => $purchase->id,
                'reference'   => $purchase->reference_number,
                'total'       => $purchase->total_amount ?? $purchase->total,
                'branch_id'   => $branchId,
            ],
            actorId:            $actor->id,
            targetRoute:        'purchases',
        );
    }

    public function handlePurchaseReceived(PurchaseReceived $event): void
    {
        $purchase  = $event->purchase;
        $actor     = $event->actor;
        $companyId = $purchase->company_id;
        $branchId  = $purchase->branch_id;

        // Compter les articles réceptionnés
        $itemCount = $purchase->details ? $purchase->details->count() : 0;
        $supplierName = $purchase->supplier ? $purchase->supplier->name : "Fournisseur #{$purchase->supplier_id}";

        NotificationService::notifyBranchUsers(
            companyId:          $companyId,
            branchId:           $branchId,
            targetRoles:        ['admin', 'gerant'],
            requiredPermission: 'purchases.view',
            type:               'purchase_received',
            title:              '✅ Achat réceptionné',
            message:            "L'achat #{$purchase->reference_number} ({$itemCount} article(s)) de {$supplierName} a été réceptionné par {$actor->name}. Stock mis à jour.",
            priority:           'important',
            data:               [
                'purchase_id' => $purchase->id,
                'reference'   => $purchase->reference_number,
                'branch_id'   => $branchId,
            ],
            actorId:            $actor->id,
            targetRoute:        'purchases',
        );
    }

    public function subscribe($events): array
    {
        return [
            PurchaseCreated::class  => 'handlePurchaseCreated',
            PurchaseReceived::class => 'handlePurchaseReceived',
        ];
    }
}
