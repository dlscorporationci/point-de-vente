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
    public function setMaintenanceMode(array $data, ?User $user = null): MaintenanceMode
    {
        $type       = $data['type'] ?? 'global';
        $companyId  = !empty($data['company_id']) ? intval($data['company_id']) : null;
        $branchId   = !empty($data['branch_id']) ? intval($data['branch_id']) : null;
        $enabled    = filter_var($data['enabled'], FILTER_VALIDATE_BOOLEAN);
        $message    = $data['message'] ?? 'L\'application est temporairement en maintenance pour optimisation.';
        $startedAt  = $enabled ? now() : null;
        $endedAt    = !$enabled ? now() : null;

        // Si désactivation, réinitialiser TOUS les enregistrements correspondant au type
        if (!$enabled) {
            $resetQuery = MaintenanceMode::where('type', $type);
            if ($companyId) {
                $resetQuery->where('company_id', $companyId);
            } else {
                $resetQuery->whereNull('company_id');
            }
            $resetQuery->update([
                'enabled'  => false,
                'ended_at' => now(),
            ]);
        }

        $maintQuery = MaintenanceMode::where('type', $type);
        if ($companyId) {
            $maintQuery->where('company_id', $companyId);
        } else {
            $maintQuery->whereNull('company_id');
        }
        if ($branchId) {
            $maintQuery->where('branch_id', $branchId);
        } else {
            $maintQuery->whereNull('branch_id');
        }

        $maint = $maintQuery->first();
        if (!$maint) {
            $maint = new MaintenanceMode();
            $maint->type = $type;
            $maint->company_id = $companyId;
            $maint->branch_id = $branchId;
        }

        $maint->enabled          = $enabled;
        $maint->message          = $message;
        $maint->started_at       = $startedAt;
        $maint->estimated_end_at = !empty($data['estimated_end_at']) ? $data['estimated_end_at'] : null;
        $maint->ended_at         = $endedAt;
        if ($user) {
            $maint->created_by   = $user->id;
        }
        $maint->save();

        // Enregistrer l'événement dans le journal d'audit
        try {
            $userRoleStr = 'SuperAdmin';
            if ($user && $user->role) {
                $userRoleStr = is_object($user->role) ? ($user->role->name ?? $user->role->slug ?? 'SuperAdmin') : (string)$user->role;
            }

            AuditLog::create([
                'company_id'     => $companyId ?: 1,
                'user_id'        => $user?->id,
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

            // Création de l'annonce globale (company_id IS NULL) avec actor_id NULL pour éviter le filtrage d'auto-émission
            \App\Models\Notification::create([
                'company_id' => null,
                'branch_id'  => null,
                'user_id'    => null,
                'title'      => $notifTitle,
                'message'    => $notifMessage,
                'type'       => $enabled ? 'warning' : 'system',
                'priority'   => $enabled ? 'warning' : 'normal',
                'actor_id'   => null,
                'data'       => json_encode(['source' => 'maintenance_toggle', 'enabled' => $enabled])
            ]);

            // Création explicite d'une notification dédiée par entreprise
            $companiesList = \App\Models\Company::all();
            foreach ($companiesList as $cItem) {
                \App\Models\Notification::create([
                    'company_id' => $cItem->id,
                    'branch_id'  => null,
                    'user_id'    => null,
                    'title'      => $notifTitle,
                    'message'    => $notifMessage,
                    'type'       => $enabled ? 'warning' : 'system',
                    'priority'   => $enabled ? 'warning' : 'normal',
                    'actor_id'   => null,
                    'data'       => json_encode(['source' => 'maintenance_toggle', 'enabled' => $enabled])
                ]);
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Échec création notification in-app de maintenance : " . $e->getMessage());
        }

        // 2. Transmettre les e-mails de notification de maintenance en tâche de fond CLI (Instantané & non-bloquant pour l'interface web)
        try {
            $basePath = base_path();
            $cmd = sprintf(
                'php %s/artisan apexpos:send-maintenance-emails --type=%s --enabled=%d %s %s > /dev/null 2>&1 &',
                $basePath,
                escapeshellarg($type),
                $enabled ? 1 : 0,
                $companyId ? '--company_id=' . (int)$companyId : '',
                $message ? '--message=' . escapeshellarg($message) : ''
            );
            
            if (function_exists('exec')) {
                @exec($cmd);
            } elseif (function_exists('popen')) {
                @pclose(@popen($cmd, 'r'));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Échec lancement CLI e-mails maintenance : " . $e->getMessage());
        }

        return $maint;
    }
}
