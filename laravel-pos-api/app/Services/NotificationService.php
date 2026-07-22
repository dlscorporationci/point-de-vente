<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    /**
     * Envoyer/enregistrer une notification système.
     */
    public static function send(
        int $companyId,
        ?int $branchId,
        ?int $userId,
        string $type,
        string $title,
        string $message,
        ?array $data = null
    ): Notification {
        return Notification::create([
            'company_id' => $companyId,
            'branch_id' => $branchId,
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }
}
