<?php

namespace App\Listeners;

use App\Events\Sale\SaleCreated;
use App\Events\Sale\SaleCancelled;
use App\Events\Stock\StockLow;
use App\Services\NotificationService;
use App\Services\RealtimeBroadcastService;

/**
 * Listener pour les événements de vente.
 * 
 * Logique :
 * - Vente créée : Admin + Gérant de la boutique (pas le vendeur lui-même)
 * - Vente annulée : Admin + Gérant avec priorité warning
 * - Stock faible : Admin + Gérant uniquement (pas caissier, pas comptable)
 */
class NotifySaleEvents
{
    /**
     * Vente créée.
     * Admin/Gérant → message avec montant et nom du vendeur.
     */
    public function handleSaleCreated(SaleCreated $event): void
    {
        $sale      = $event->sale;
        $actor     = $event->actor;
        $companyId = $sale->company_id;
        $branchId  = $sale->branch_id;

        $totalFormatted = number_format($sale->total, 0, ',', ' ');
        $clientName = $sale->client_name ?: 'Client comptant';

        NotificationService::notifyBranchUsers(
            companyId:          $companyId,
            branchId:           $branchId,
            targetRoles:        ['admin', 'gerant'],
            requiredPermission: 'sales.view',
            type:               'sale_created',
            title:              '🛒 Nouvelle vente',
            message:            "Vente #{$sale->sale_number} de {$totalFormatted} XOF enregistrée par {$actor->name}. Client : {$clientName}.",
            priority:           'info',
            data:               [
                'sale_id'     => $sale->id,
                'sale_number' => $sale->sale_number,
                'total'       => $sale->total,
                'branch_id'   => $branchId,
            ],
            actorId:            $actor->id,
            targetRoute:        'sales',
        );

        // SSE — Signal temps réel : vente créée
        RealtimeBroadcastService::push(
            eventType: 'sale_created',
            companyId: $companyId,
            branchId:  $branchId,
            payload:   [
                'sale_id'     => $sale->id,
                'sale_number' => $sale->sale_number,
                'total'       => $sale->total,
                'client_name' => $clientName,
                'cashier_id'  => $actor->id,
                'cashier_name'=> $actor->name,
            ],
            actorId: $actor->id
        );
    }

    /**
     * Vente annulée.
     */
    public function handleSaleCancelled(SaleCancelled $event): void
    {
        $sale      = $event->sale;
        $actor     = $event->actor;
        $companyId = $sale->company_id;
        $branchId  = $sale->branch_id;

        $totalFormatted = number_format($sale->total, 0, ',', ' ');

        NotificationService::notifyBranchUsers(
            companyId:          $companyId,
            branchId:           $branchId,
            targetRoles:        ['admin', 'gerant'],
            requiredPermission: 'sales.cancel',
            type:               'sale_cancelled',
            title:              '⛔ Vente annulée',
            message:            "La vente #{$sale->sale_number} ({$totalFormatted} XOF) a été annulée par {$actor->name}.",
            priority:           'warning',
            data:               ['sale_id' => $sale->id, 'sale_number' => $sale->sale_number],
            actorId:            $actor->id,
            targetRoute:        'sales',
        );

        // SSE — Signal temps réel : vente annulée
        RealtimeBroadcastService::push(
            eventType: 'sale_cancelled',
            companyId: $companyId,
            branchId:  $branchId,
            payload:   [
                'sale_id'     => $sale->id,
                'sale_number' => $sale->sale_number,
                'total'       => $sale->total,
                'actor_name'  => $actor->name,
            ],
            actorId: $actor->id
        );
    }

    public function subscribe($events): array
    {
        return [
            SaleCreated::class   => 'handleSaleCreated',
            SaleCancelled::class => 'handleSaleCancelled',
        ];
    }
}
