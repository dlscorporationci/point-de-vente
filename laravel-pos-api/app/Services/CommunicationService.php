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

        // 1. Création de la notification in-app pour alimenter la cloche de notification des utilisateurs
        try {
            \App\Models\Notification::create([
                'company_id' => $companyId,
                'branch_id'  => $branchId,
                'user_id'    => $userId,
                'title'      => $subject,
                'message'    => $message,
                'type'       => ($channel === 'email' || $channel === 'courriel') ? 'system' : (($channel === 'notification') ? 'info' : 'system'),
                'priority'   => 'normal',
                'actor_id'   => $sender->id,
                'data'       => json_encode(['source' => 'communication_center', 'channel' => $channel])
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Échec création Notification in-app dans CommunicationService : " . $e->getMessage());
        }

        // 2. Expédition de l'email si le canal sélectionné contient 'email' ou 'courriel'
        if (in_array(strtolower($channel), ['email', 'courriel', 'mail'])) {
            try {
                $emailService = new \App\Services\EmailService();

                if ($userId) {
                    $targetUser = User::find($userId);
                    if ($targetUser && $targetUser->email) {
                        $emailService->sendMaintenanceNotificationEmail(
                            recipient: $targetUser->email,
                            title: $subject,
                            messageBody: $message,
                            status: 'announcement',
                            companyId: $companyId
                        );
                    }
                } elseif ($companyId) {
                    $targetCompany = Company::find($companyId);
                    if ($targetCompany) {
                        $adminUser = User::withoutGlobalScopes()
                            ->where('company_id', $companyId)
                            ->where('status', 'active')
                            ->first();
                        $recipient = $adminUser?->email ?: ($targetCompany->email ?: 'infos@dlscorporation.ci');
                        $emailService->sendMaintenanceNotificationEmail(
                            recipient: $recipient,
                            title: $subject,
                            messageBody: $message,
                            status: 'announcement',
                            companyId: $companyId
                        );
                    }
                } else {
                    // Message global diffusé à toutes les entreprises
                    $companies = Company::all();
                    foreach ($companies as $comp) {
                        $adminUser = User::withoutGlobalScopes()
                            ->where('company_id', $comp->id)
                            ->where('status', 'active')
                            ->first();
                        $recipient = $adminUser?->email ?: ($comp->email ?: null);
                        if ($recipient) {
                            $emailService->sendMaintenanceNotificationEmail(
                                recipient: $recipient,
                                title: $subject,
                                messageBody: $message,
                                status: 'announcement',
                                companyId: $comp->id
                            );
                        }
                    }
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning("Échec expédition mail dans CommunicationService : " . $e->getMessage());
            }
        }

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
