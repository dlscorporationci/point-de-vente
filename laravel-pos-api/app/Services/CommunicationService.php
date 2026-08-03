<?php

namespace App\Services;

use App\Models\CommunicationLog;
use App\Models\Company;
use App\Models\Branch;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Mail;

class CommunicationService
{
    /**
     * Envoie une communication (message système ou email) et enregistre la traçabilité.
     */
    public function sendCommunication(array $data, User $sender): CommunicationLog
    {
        $channel   = $data['channel'] ?? 'system_message';
        $subject   = $data['subject'];
        $message   = $data['message'];
        $companyId = $data['company_id'] ?? null;
        $branchId  = $data['branch_id'] ?? null;
        $userId    = $data['user_id'] ?? null;

        $log = CommunicationLog::create([
            'company_id' => $companyId,
            'branch_id'  => $branchId,
            'user_id'    => $userId,
            'sender_id'  => $sender->id,
            'channel'    => $channel,
            'subject'    => $subject,
            'message'    => $message,
            'status'     => 'sent',
            'sent_at'    => now(),
        ]);

        // Audit Log de l'envoi de la communication
        AuditLog::create([
            'company_id'     => $companyId ?: 1,
            'branch_id'      => $branchId,
            'user_id'        => $sender->id,
            'user_role'      => $sender->role ? $sender->role->name : 'SuperAdmin',
            'auditable_type' => CommunicationLog::class,
            'auditable_id'   => $log->id,
            'action'         => 'COMMUNICATION_SENT',
            'module'         => 'CommunicationCenter',
            'description'    => "Envoi de message via le canal [{$channel}] - Sujet: {$subject}",
            'ip_address'     => request()->ip(),
            'device'         => request()->userAgent(),
            'result'         => 'success',
        ]);

        return $log;
    }
}
