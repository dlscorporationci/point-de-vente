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
        AuditLog::create([
            'company_id'     => $companyId ?: 1,
            'user_id'        => $user->id,
            'user_role'      => $user->role ? $user->role->name : 'SuperAdmin',
            'auditable_type' => MaintenanceMode::class,
            'auditable_id'   => $maint->id,
            'action'         => $enabled ? 'MAINTENANCE_ENABLED' : 'MAINTENANCE_DISABLED',
            'module'         => 'SystemMaintenance',
            'description'    => ($enabled ? 'Activation' : 'Désactivation') . " de la maintenance [Type: {$type}]",
            'ip_address'     => request()->ip(),
            'device'         => request()->userAgent(),
            'result'         => 'success',
        ]);

        return $maint;
    }
}
