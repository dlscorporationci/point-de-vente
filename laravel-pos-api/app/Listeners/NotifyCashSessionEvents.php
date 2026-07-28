<?php

namespace App\Listeners;

use App\Events\CashSession\CashSessionOpened;
use App\Events\CashSession\CashSessionClosed;
use App\Events\CashSession\CashSessionValidated;
use App\Events\CashSession\CashSessionTransactionAdded;
use App\Services\NotificationService;

/**
 * Listener pour tous les événements de session de caisse.
 * 
 * Logique de ciblage :
 * - Ouverture : Admin + Gérant (message détaillé) de la même boutique
 * - Fermeture : Admin + Gérant (message détaillé avec écart) de la même boutique
 *               + Propriétaire de la session (message de confirmation)
 * - Validation : Propriétaire de la session + Admin
 * - Transaction : Admin + Gérant de la même boutique
 */
class NotifyCashSessionEvents
{
    /**
     * Ouverture de caisse.
     * Admin/Gérant → message détaillé avec le nom du caissier, fond, heure.
     */
    public function handleOpened(CashSessionOpened $event): void
    {
        $session = $event->session;
        $actor   = $event->actor;
        $companyId = $session->company_id;
        $branchId  = $session->branch_id;

        $openedAt = $session->opened_at
            ? \Carbon\Carbon::parse($session->opened_at)->format('H:i')
            : now()->format('H:i');

        // Message complet pour Admin/Gérant
        $detailedMessage = "{$actor->name} a ouvert la caisse #{$session->id} à {$openedAt} avec un fond de " . number_format($session->opening_balance, 0, ',', ' ') . " XOF.";

        NotificationService::notifyBranchUsers(
            companyId:          $companyId,
            branchId:           $branchId,
            targetRoles:        ['admin', 'gerant'],
            requiredPermission: 'cash-sessions.manage',
            type:               'cash_session_opened',
            title:              '🟢 Caisse ouverte',
            message:            $detailedMessage,
            priority:           'info',
            data:               ['session_id' => $session->id, 'branch_id' => $branchId],
            actorId:            $actor->id,
            targetRoute:        'cash-sessions',
        );
    }

    /**
     * Fermeture de caisse.
     * Admin/Gérant → message détaillé avec écart.
     * Propriétaire (caissier) → message de confirmation simple.
     */
    public function handleClosed(CashSessionClosed $event): void
    {
        $session   = $event->session;
        $actor     = $event->actor;
        $gap       = $event->gap;
        $companyId = $session->company_id;
        $branchId  = $session->branch_id;

        $closedAt = $session->closed_at
            ? \Carbon\Carbon::parse($session->closed_at)->format('H:i')
            : now()->format('H:i');

        $gapSign    = $gap >= 0 ? '+' : '';
        $gapFormatted = number_format($gap, 0, ',', ' ');
        $closingFormatted = number_format($session->closing_balance ?? 0, 0, ',', ' ');

        // Message complet pour Admin/Gérant (avec données financières sensibles)
        $detailedMessage = "{$actor->name} a fermé la caisse #{$session->id} à {$closedAt}. Solde compté : {$closingFormatted} XOF. Écart : {$gapSign}{$gapFormatted} XOF.";

        // Message simplifié pour d'autres rôles éventuels (sans données financières)
        $simpleMessage = "Caisse #{$session->id} fermée à {$closedAt} par {$actor->name}.";

        $priority = abs($gap) > 5000 ? 'warning' : 'info';

        // Notifier Admin + Gérant avec message financier complet
        NotificationService::notifyBranchUsers(
            companyId:          $companyId,
            branchId:           $branchId,
            targetRoles:        ['admin', 'gerant'],
            requiredPermission: 'cash-sessions.manage',
            type:               'cash_session_closed',
            title:              '🔴 Caisse fermée',
            message:            $detailedMessage,
            priority:           $priority,
            data:               [
                'session_id'       => $session->id,
                'closing_balance'  => $session->closing_balance,
                'gap'              => $gap,
                'branch_id'        => $branchId,
            ],
            actorId:            $actor->id,
            targetRoute:        'cash-sessions',
        );

        // Notifier le propriétaire de la session (s'il n'est pas admin/gérant)
        // avec un message de confirmation simple
        $owner = \App\Models\User::find($session->user_id);
        if ($owner && $owner->id !== $actor->id) {
            $ownerRole = $owner->role ? $owner->role->slug : '';
            if (!in_array($ownerRole, ['admin', 'gerant'])) {
                NotificationService::send(
                    $companyId,
                    $branchId,
                    $owner->id,
                    'cash_session_closed',
                    '🔴 Votre caisse a été fermée',
                    $simpleMessage,
                    'info',
                    null,
                    'cash-sessions',
                    ['session_id' => $session->id],
                    $actor->id
                );
            }
        }
    }

    /**
     * Validation de caisse par un gérant/admin.
     * Notifier le propriétaire de la session.
     */
    public function handleValidated(CashSessionValidated $event): void
    {
        $session   = $event->session;
        $actor     = $event->actor;
        $companyId = $session->company_id;
        $branchId  = $session->branch_id;

        // Notifier le propriétaire de la session
        $owner = \App\Models\User::find($session->user_id);
        if ($owner && $owner->id !== $actor->id) {
            NotificationService::send(
                $companyId,
                $branchId,
                $owner->id,
                'cash_session_validated',
                '✅ Caisse validée',
                "Votre caisse #{$session->id} a été validée par {$actor->name}.",
                'info',
                null,
                'cash-sessions',
                ['session_id' => $session->id],
                $actor->id
            );
        }

        // Notifier aussi les autres admins/gérants
        NotificationService::notifyBranchUsers(
            companyId:          $companyId,
            branchId:           $branchId,
            targetRoles:        ['admin'],
            requiredPermission: 'cash-sessions.manage',
            type:               'cash_session_validated',
            title:              '✅ Caisse validée',
            message:            "{$actor->name} a validé la caisse #{$session->id}.",
            priority:           'info',
            data:               ['session_id' => $session->id],
            actorId:            $actor->id,
            targetRoute:        'cash-sessions',
        );
    }

    /**
     * Dépôt/Retrait dans une caisse.
     * Admin + Gérant de la même boutique.
     */
    public function handleTransactionAdded(CashSessionTransactionAdded $event): void
    {
        $session     = $event->session;
        $transaction = $event->transaction;
        $actor       = $event->actor;
        $companyId   = $session->company_id;
        $branchId    = $session->branch_id;

        $typeLabel = $transaction->type === 'deposit' ? '📥 Dépôt' : '📤 Retrait';
        $amountFormatted = number_format($transaction->amount, 0, ',', ' ');

        NotificationService::notifyBranchUsers(
            companyId:          $companyId,
            branchId:           $branchId,
            targetRoles:        ['admin', 'gerant'],
            requiredPermission: 'cash-sessions.manage',
            type:               'cash_session_transaction',
            title:              "{$typeLabel} en caisse",
            message:            "{$actor->name} a effectué un {$transaction->type} de {$amountFormatted} XOF en caisse #{$session->id}. Motif : {$transaction->description}",
            priority:           'info',
            data:               [
                'session_id'     => $session->id,
                'transaction_id' => $transaction->id,
                'type'           => $transaction->type,
                'amount'         => $transaction->amount,
            ],
            actorId:            $actor->id,
            targetRoute:        'cash-sessions',
        );
    }

    /**
     * Enregistrement des listeners dans l'EventServiceProvider.
     */
    public function subscribe($events): array
    {
        return [
            CashSessionOpened::class          => 'handleOpened',
            CashSessionClosed::class          => 'handleClosed',
            CashSessionValidated::class       => 'handleValidated',
            CashSessionTransactionAdded::class => 'handleTransactionAdded',
        ];
    }
}
