<?php

namespace App\Listeners;

use App\Events\Transfer\TransferCreated;
use App\Events\Transfer\TransferApproved;
use App\Events\Transfer\TransferShipped;
use App\Events\Transfer\TransferReceived;
use App\Events\Transfer\TransferRejected;
use App\Events\Transfer\TransferCancelled;
use App\Models\Branch;
use App\Services\NotificationService;

/**
 * Listener pour tous les événements de transfert inter-boutiques.
 * 
 * RÈGLE FONDAMENTALE :
 * Un transfert implique DEUX boutiques. Chacune doit recevoir les informations
 * qui la concernent UNIQUEMENT.
 * 
 * Boutique tiers non concernées → RIEN.
 * 
 * Ciblage : Admin + Gérant de chaque boutique concernée.
 * Permission requise : transfers.view (lecture) ou transfers.manage (actions).
 */
class NotifyTransferEvents
{
    /**
     * Transfert créé.
     * - Boutique A (origine) → "Votre transfert a été créé vers Boutique B"
     * - Boutique B (destination) → "Nouveau transfert entrant de Boutique A en attente"
     */
    public function handleCreated(TransferCreated $event): void
    {
        $transfer   = $event->transfer;
        $actor      = $event->actor;
        $companyId  = $transfer->company_id;
        $fromBranch = Branch::find($transfer->from_branch_id);
        $toBranch   = Branch::find($transfer->to_branch_id);

        $fromBranchName = $fromBranch ? $fromBranch->name : "Boutique #{$transfer->from_branch_id}";
        $toBranchName   = $toBranch   ? $toBranch->name   : "Boutique #{$transfer->to_branch_id}";

        NotificationService::notifyMultipleBranches(
            companyId:   $companyId,
            type:        'transfer_created',
            title:       '📤 Transfert créé',
            priority:    'info',
            data:        [
                'transfer_id'     => $transfer->id,
                'transfer_number' => $transfer->transfer_number,
                'from_branch_id'  => $transfer->from_branch_id,
                'to_branch_id'    => $transfer->to_branch_id,
            ],
            actorId:     $actor->id,
            targetRoute: 'transfers',
            notifications: [
                // Boutique A (origine) : confirmation de création
                [
                    'branch_id'  => $transfer->from_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.create',
                    'message'    => "{$actor->name} a créé le transfert #{$transfer->transfer_number} vers {$toBranchName}.",
                ],
                // Boutique B (destination) : alerte transfert entrant
                [
                    'branch_id'  => $transfer->to_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.view',
                    'message'    => "Nouveau transfert #{$transfer->transfer_number} entrant de {$fromBranchName} — en attente d'approbation.",
                ],
            ]
        );
    }

    /**
     * Transfert approuvé.
     * - Boutique A → "Transfert approuvé, en attente d'expédition"
     * - Boutique B → "Transfert #{} approuvé, expédition imminente"
     */
    public function handleApproved(TransferApproved $event): void
    {
        $transfer   = $event->transfer;
        $actor      = $event->actor;
        $companyId  = $transfer->company_id;
        $fromBranch = Branch::find($transfer->from_branch_id);
        $toBranch   = Branch::find($transfer->to_branch_id);

        $fromBranchName = $fromBranch ? $fromBranch->name : "Boutique #{$transfer->from_branch_id}";
        $toBranchName   = $toBranch   ? $toBranch->name   : "Boutique #{$transfer->to_branch_id}";

        NotificationService::notifyMultipleBranches(
            companyId:   $companyId,
            type:        'transfer_approved',
            title:       '✅ Transfert approuvé',
            priority:    'important',
            data:        [
                'transfer_id'     => $transfer->id,
                'transfer_number' => $transfer->transfer_number,
            ],
            actorId:     $actor->id,
            targetRoute: 'transfers',
            notifications: [
                [
                    'branch_id'  => $transfer->from_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.manage',
                    'message'    => "Le transfert #{$transfer->transfer_number} vers {$toBranchName} a été approuvé par {$actor->name}. Il peut être expédié.",
                ],
                [
                    'branch_id'  => $transfer->to_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.view',
                    'message'    => "Le transfert #{$transfer->transfer_number} de {$fromBranchName} a été approuvé. Expédition en cours de préparation.",
                ],
            ]
        );
    }

    /**
     * Transfert expédié.
     * - Boutique A → "Transfert expédié depuis votre boutique"
     * - Boutique B → "Transfert en route — préparez la réception"
     */
    public function handleShipped(TransferShipped $event): void
    {
        $transfer   = $event->transfer;
        $actor      = $event->actor;
        $companyId  = $transfer->company_id;
        $fromBranch = Branch::find($transfer->from_branch_id);
        $toBranch   = Branch::find($transfer->to_branch_id);

        $fromBranchName = $fromBranch ? $fromBranch->name : "Boutique #{$transfer->from_branch_id}";
        $toBranchName   = $toBranch   ? $toBranch->name   : "Boutique #{$transfer->to_branch_id}";

        // Compter les articles transférés
        $itemCount = $transfer->details ? $transfer->details->count() : 0;

        NotificationService::notifyMultipleBranches(
            companyId:   $companyId,
            type:        'transfer_shipped',
            title:       '🚚 Transfert expédié',
            priority:    'important',
            data:        [
                'transfer_id'     => $transfer->id,
                'transfer_number' => $transfer->transfer_number,
                'item_count'      => $itemCount,
            ],
            actorId:     $actor->id,
            targetRoute: 'transfers',
            notifications: [
                // Boutique A : confirmation d'expédition
                [
                    'branch_id'  => $transfer->from_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.manage',
                    'message'    => "{$actor->name} a expédié le transfert #{$transfer->transfer_number} ({$itemCount} article(s)) vers {$toBranchName}. Stock débité.",
                ],
                // Boutique B : alerte réception à venir
                [
                    'branch_id'  => $transfer->to_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.view',
                    'message'    => "Le transfert #{$transfer->transfer_number} ({$itemCount} article(s)) de {$fromBranchName} est en route. Préparez la réception.",
                ],
            ]
        );
    }

    /**
     * Transfert réceptionné.
     * - Boutique A → "Votre transfert a été réceptionné par Boutique B"
     * - Boutique B → "Transfert réceptionné — stock mis à jour"
     */
    public function handleReceived(TransferReceived $event): void
    {
        $transfer   = $event->transfer;
        $actor      = $event->actor;
        $companyId  = $transfer->company_id;
        $fromBranch = Branch::find($transfer->from_branch_id);
        $toBranch   = Branch::find($transfer->to_branch_id);

        $fromBranchName = $fromBranch ? $fromBranch->name : "Boutique #{$transfer->from_branch_id}";
        $toBranchName   = $toBranch   ? $toBranch->name   : "Boutique #{$transfer->to_branch_id}";
        $itemCount      = $transfer->details ? $transfer->details->count() : 0;

        NotificationService::notifyMultipleBranches(
            companyId:   $companyId,
            type:        'transfer_received',
            title:       '✅ Transfert réceptionné',
            priority:    'important',
            data:        [
                'transfer_id'     => $transfer->id,
                'transfer_number' => $transfer->transfer_number,
            ],
            actorId:     $actor->id,
            targetRoute: 'transfers',
            notifications: [
                // Boutique A (origine) : confirmation que le destinataire a reçu
                [
                    'branch_id'  => $transfer->from_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.view',
                    'message'    => "Le transfert #{$transfer->transfer_number} vers {$toBranchName} a été réceptionné par {$actor->name}. Circuit complet.",
                ],
                // Boutique B (destination) : confirmation interne + stock
                [
                    'branch_id'  => $transfer->to_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.manage',
                    'message'    => "{$actor->name} a réceptionné le transfert #{$transfer->transfer_number} ({$itemCount} article(s)) de {$fromBranchName}. Stock crédité.",
                ],
            ]
        );
    }

    /**
     * Transfert rejeté.
     * - Boutique A → "Votre transfert a été rejeté — stock restitué"
     * - Boutique B → "Transfert rejeté"
     */
    public function handleRejected(TransferRejected $event): void
    {
        $transfer   = $event->transfer;
        $actor      = $event->actor;
        $companyId  = $transfer->company_id;
        $fromBranch = Branch::find($transfer->from_branch_id);
        $toBranch   = Branch::find($transfer->to_branch_id);

        $fromBranchName = $fromBranch ? $fromBranch->name : "Boutique #{$transfer->from_branch_id}";
        $toBranchName   = $toBranch   ? $toBranch->name   : "Boutique #{$transfer->to_branch_id}";

        NotificationService::notifyMultipleBranches(
            companyId:   $companyId,
            type:        'transfer_rejected',
            title:       '❌ Transfert rejeté',
            priority:    'warning',
            data:        [
                'transfer_id'     => $transfer->id,
                'transfer_number' => $transfer->transfer_number,
            ],
            actorId:     $actor->id,
            targetRoute: 'transfers',
            notifications: [
                [
                    'branch_id'  => $transfer->from_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.view',
                    'message'    => "Le transfert #{$transfer->transfer_number} vers {$toBranchName} a été rejeté par {$actor->name}. Stock restitué.",
                ],
                [
                    'branch_id'  => $transfer->to_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.manage',
                    'message'    => "{$actor->name} a rejeté le transfert #{$transfer->transfer_number} de {$fromBranchName}.",
                ],
            ]
        );
    }

    /**
     * Transfert annulé.
     * Les deux boutiques sont informées.
     */
    public function handleCancelled(TransferCancelled $event): void
    {
        $transfer   = $event->transfer;
        $actor      = $event->actor;
        $companyId  = $transfer->company_id;
        $fromBranch = Branch::find($transfer->from_branch_id);
        $toBranch   = Branch::find($transfer->to_branch_id);

        $fromBranchName = $fromBranch ? $fromBranch->name : "Boutique #{$transfer->from_branch_id}";
        $toBranchName   = $toBranch   ? $toBranch->name   : "Boutique #{$transfer->to_branch_id}";

        NotificationService::notifyMultipleBranches(
            companyId:   $companyId,
            type:        'transfer_cancelled',
            title:       '🚫 Transfert annulé',
            priority:    'warning',
            data:        [
                'transfer_id'     => $transfer->id,
                'transfer_number' => $transfer->transfer_number,
            ],
            actorId:     $actor->id,
            targetRoute: 'transfers',
            notifications: [
                [
                    'branch_id'  => $transfer->from_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.manage',
                    'message'    => "{$actor->name} a annulé le transfert #{$transfer->transfer_number} vers {$toBranchName}.",
                ],
                [
                    'branch_id'  => $transfer->to_branch_id,
                    'roles'      => ['admin', 'gerant'],
                    'permission' => 'transfers.view',
                    'message'    => "Le transfert #{$transfer->transfer_number} de {$fromBranchName} a été annulé.",
                ],
            ]
        );
    }

    public function subscribe($events): array
    {
        return [
            TransferCreated::class   => 'handleCreated',
            TransferApproved::class  => 'handleApproved',
            TransferShipped::class   => 'handleShipped',
            TransferReceived::class  => 'handleReceived',
            TransferRejected::class  => 'handleRejected',
            TransferCancelled::class => 'handleCancelled',
        ];
    }
}
