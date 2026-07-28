<?php

namespace App\Listeners;

use App\Events\Stock\StockLow;
use App\Events\Stock\StockAdjusted;
use App\Services\NotificationService;

/**
 * Listener pour les événements de stock.
 * 
 * Logique :
 * - Stock faible : Admin + Gérant uniquement (ils peuvent agir sur le stock)
 *   NE PAS notifier caissier ou comptable
 * - Ajustement stock : Admin + Gérant de la boutique
 */
class NotifyStockEvents
{
    /**
     * Stock faible détecté.
     * Admin/Gérant uniquement → message avec quantité restante et seuil.
     */
    public function handleStockLow(StockLow $event): void
    {
        $qtyFormatted   = number_format($event->currentQuantity, 0, ',', ' ');
        $alertFormatted = number_format($event->alertQuantity, 0, ',', ' ');

        NotificationService::notifyBranchUsers(
            companyId:          $event->companyId,
            branchId:           $event->branchId,
            targetRoles:        ['admin', 'gerant'],
            requiredPermission: 'stock.adjust',
            type:               'stock_low',
            title:              '⚠️ Stock faible',
            message:            "Stock faible : {$event->productName} — {$qtyFormatted} unité(s) restante(s) (seuil d'alerte : {$alertFormatted}).",
            priority:           'warning',
            data:               [
                'product_id'       => $event->productId,
                'product_name'     => $event->productName,
                'current_quantity' => $event->currentQuantity,
                'alert_quantity'   => $event->alertQuantity,
                'branch_id'        => $event->branchId,
            ],
            actorId:            null,
            targetRoute:        'stocks',
        );
    }

    /**
     * Ajustement de stock.
     * Admin/Gérant → message avec le produit, la quantité et l'auteur.
     */
    public function handleStockAdjusted(StockAdjusted $event): void
    {
        $sign          = $event->quantity >= 0 ? '+' : '';
        $qtyFormatted  = number_format($event->quantity, 0, ',', ' ');

        NotificationService::notifyBranchUsers(
            companyId:          $event->companyId,
            branchId:           $event->branchId,
            targetRoles:        ['admin', 'gerant'],
            requiredPermission: 'stock.adjust',
            type:               'stock_adjusted',
            title:              '🔄 Ajustement de stock',
            message:            "{$event->actor->name} a ajusté le stock de {$event->productName} ({$sign}{$qtyFormatted}). Motif : {$event->description}",
            priority:           'info',
            data:               [
                'product_id'   => $event->productId,
                'product_name' => $event->productName,
                'quantity'     => $event->quantity,
                'branch_id'    => $event->branchId,
            ],
            actorId:            $event->actor->id,
            targetRoute:        'stocks',
        );
    }

    public function subscribe($events): array
    {
        return [
            StockLow::class      => 'handleStockLow',
            StockAdjusted::class => 'handleStockAdjusted',
        ];
    }
}
