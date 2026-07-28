<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    /**
     * Envoyer/enregistrer une notification système ciblée avec sécurité par entreprise, boutique, rôle et permission.
     */
    public static function send(
        int $companyId,
        ?int $branchId,
        ?int $userId,
        string $type,
        string $title,
        string $message,
        string $priority = 'info',
        ?string $permissionRequired = null,
        ?string $targetRoute = null,
        ?array $data = null,
        ?int $actorId = null
    ): Notification {
        return Notification::create([
            'company_id'          => $companyId,
            'branch_id'           => $branchId,
            'user_id'             => $userId,
            'actor_id'            => $actorId,
            'type'                => $type,
            'priority'            => in_array($priority, ['info', 'important', 'warning', 'critical']) ? $priority : 'info',
            'permission_required' => $permissionRequired,
            'target_route'        => $targetRoute,
            'title'               => $title,
            'message'             => $message,
            'data'                => $data,
        ]);
    }
}
