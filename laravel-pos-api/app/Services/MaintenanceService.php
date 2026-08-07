<?php

namespace App\Services;

use App\Models\MaintenanceMode;
use App\Models\AuditLog;
use App\Models\User;

class MaintenanceService
{
    /**
     * Vérifier si l'application ou l'entreprise est actuellement en mode maintenance.
     */
    public function isMaintenanceActive(?int $companyId = null, ?int $branchId = null): ?MaintenanceMode
    {
        // 1. Vérifier la maintenance globale
        $global = MaintenanceMode::where('type', 'global')->where('enabled', true)->first();
        if ($global) {
            return $global;
        }

        // 2. Vérifier la maintenance ciblée par entreprise
        if ($companyId) {
            $companyMaint = MaintenanceMode::where('type', 'company')
                ->where('company_id', $companyId)
                ->where('enabled', true)
                ->first();
            if ($companyMaint) {
                return $companyMaint;
            }
        }

        return null;
    }

    /**
     * Activer ou mettre à jour le mode maintenance.
     */
    public function setMaintenanceMode(array $data, User $user): MaintenanceMode
    {
        $type       = $data['type'] ?? 'global';
        $companyId  = $data['company_id'] ?? null;
        $branchId   = $data['branch_id'] ?? null;
        $enabled    = filter_var($data['enabled'], FILTER_VALIDATE_BOOLEAN);
        $message    = $data['message'] ?? 'L\'application est temporairement en maintenance pour optimisation.';
        $startedAt  = $enabled ? now() : null;
        $endedAt    = !$enabled ? now() : null;

        $maint = MaintenanceMode::updateOrCreate(
            ['type' => $type, 'company_id' => $companyId, 'branch_id' => $branchId],
            [
                'enabled'          => $enabled,
                'message'          => $message,
                'started_at'       => $startedAt,
                'estimated_end_at' => !empty($data['estimated_end_at']) ? $data['estimated_end_at'] : null,
                'ended_at'         => $endedAt,
                'created_by'       => $user->id,
            ]
        );

        // Enregistrer l'événement dans le journal d'audit
        try {
            $userRoleStr = 'SuperAdmin';
            if ($user->role) {
                $userRoleStr = is_object($user->role) ? ($user->role->name ?? $user->role->slug ?? 'SuperAdmin') : (string)$user->role;
            }

            AuditLog::create([
                'company_id'     => $companyId ?: 1,
                'user_id'        => $user->id,
                'user_role'      => $userRoleStr,
                'auditable_type' => MaintenanceMode::class,
                'auditable_id'   => $maint->id,
                'action'         => $enabled ? 'MAINTENANCE_ENABLED' : 'MAINTENANCE_DISABLED',
                'module'         => 'SystemMaintenance',
                'description'    => ($enabled ? 'Activation' : 'Désactivation') . " de la maintenance [Type: {$type}]",
                'ip_address'     => request()->ip(),
                'device'         => request()->userAgent(),
                'result'         => 'success',
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Échec création AuditLog maintenance : " . $e->getMessage());
        }

        // 1. Création de la notification in-app pour tous les utilisateurs (cloche & volet de notification)
        try {
            $notifTitle = $enabled 
                ? '🛠️ Maintenance Système en cours' 
                : '🎉 Maintenance terminée — DLS POS est opérationnel';
            
            $notifMessage = $enabled 
                ? ($message ?: 'Une intervention de maintenance est actuellement en cours sur la plateforme DLS POS.')
                : 'L\'intervention de maintenance est terminée avec succès. Tous les services DLS POS (caisse, ventes, stocks) sont de nouveau pleinement opérationnels.';

            \App\Models\Notification::create([
                'company_id' => $companyId,
                'branch_id'  => $branchId,
                'user_id'    => null,
                'title'      => $notifTitle,
                'message'    => $notifMessage,
                'type'       => $enabled ? 'warning' : 'system',
                'priority'   => $enabled ? 'warning' : 'normal',
                'actor_id'   => $user->id,
                'data'       => json_encode(['source' => 'maintenance_toggle', 'enabled' => $enabled])
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Échec création notification in-app de maintenance : " . $e->getMessage());
        }

        // 2. Transmettre les e-mails de notification de maintenance à toutes les entreprises clientes
        try {
            $emailService = new \App\Services\EmailService();
            $status = $enabled ? 'started' : 'completed';
            $title = $enabled ? 'Intervention de Maintenance Système SaaS' : '🎉 Fin de l\'Intervention de Maintenance DLS POS';
            $endsAtStr = $maint->estimated_end_at ? \Carbon\Carbon::parse($maint->estimated_end_at)->format('d/m/Y H:i') : null;
            $mailBody = $enabled 
                ? $message 
                : 'Nous vous informons que la maintenance système est officiellement terminée. La plateforme DLS POS est de nouveau disponible et pleinement fonctionnelle pour toutes vos opérations.';

            if ($type === 'global') {
                $companies = \App\Models\Company::all();
                foreach ($companies as $comp) {
                    $adminUser = \App\Models\User::withoutGlobalScopes()
                        ->where('company_id', $comp->id)
                        ->where('status', 'active')
                        ->first();
                    $recipient = $adminUser?->email ?: ($comp->email ?: 'infos@dlscorporation.ci');
                    $emailService->sendMaintenanceNotificationEmail(
                        recipient: $recipient,
                        title: $title,
                        messageBody: $mailBody,
                        status: $status,
                        startsAt: $maint->started_at ? $maint->started_at->format('d/m/Y H:i') : null,
                        endsAt: $endsAtStr,
                        companyId: $comp->id
                    );
                }
            } elseif ($companyId) {
                $comp = \App\Models\Company::find($companyId);
                if ($comp) {
                    $adminUser = \App\Models\User::withoutGlobalScopes()
                        ->where('company_id', $comp->id)
                        ->where('status', 'active')
                        ->first();
                    $recipient = $adminUser?->email ?: ($comp->email ?: 'infos@dlscorporation.ci');
                    $emailService->sendMaintenanceNotificationEmail(
                        recipient: $recipient,
                        title: $title,
                        messageBody: $mailBody,
                        status: $status,
                        startsAt: $maint->started_at ? $maint->started_at->format('d/m/Y H:i') : null,
                        endsAt: $endsAtStr,
                        companyId: $comp->id
                    );
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Échec envoi mails maintenance : " . $e->getMessage());
        }

        return $maint;
    }
}
