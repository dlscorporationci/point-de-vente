<?php

namespace App\Traits;

use App\Models\AuditLog;
use App\Services\TenantManager;
use Illuminate\Database\Eloquent\Model;

trait Auditable
{
    /**
     * Boot the trait to listen to Model Eloquent events.
     */
    protected static function bootAuditable(): void
    {
        static::created(function (Model $model) {
            static::logAuditEvent($model, 'created');
        });

        static::updated(function (Model $model) {
            if (empty($model->getChanges())) {
                return;
            }
            static::logAuditEvent($model, 'updated');
        });

        static::deleted(function (Model $model) {
            static::logAuditEvent($model, 'deleted');
        });
    }

    /**
     * Enregistrer l'événement d'audit.
     */
    protected static function logAuditEvent(Model $model, string $action): void
    {
        try {
            $tenantManager = app(TenantManager::class);
            $companyId = $tenantManager->getCompanyId() ?: $model->company_id;

            if (!$companyId) {
                return; // Impossible de logger sans compagnie
            }

            $userId = auth()->id();
            $user = auth()->user();
            $userRole = ($user && $user->role) ? $user->role->slug : null;
            $branchId = $tenantManager->getBranchId() ?: ($model->branch_id ?? ($user ? $user->branch_id : null));

            $module = class_basename($model);
            $userAgent = request()->userAgent();
            $device = 'Web App';
            if ($userAgent) {
                if (str_contains($userAgent, 'Mobile') || str_contains($userAgent, 'Android') || str_contains($userAgent, 'iPhone')) {
                    $device = 'Mobile App / Browser';
                } elseif (str_contains($userAgent, 'Postman') || str_contains($userAgent, 'curl')) {
                    $device = 'API Client';
                }
            }
            
            $oldValues = null;
            $newValues = null;

            if ($action === 'updated') {
                $changes = $model->getChanges();
                $original = $model->getOriginal();

                $oldValues = [];
                $newValues = [];

                foreach ($changes as $key => $value) {
                    if (in_array($key, ['updated_at', 'created_at'])) {
                        continue;
                    }
                    $oldValues[$key] = $original[$key] ?? null;
                    $newValues[$key] = $value;
                }

                if (empty($newValues)) {
                    return; // Pas de vraies modifications d'attributs
                }
            } elseif ($action === 'created') {
                $newValues = $model->toArray();
                unset($newValues['created_at'], $newValues['updated_at']);
            } elseif ($action === 'deleted') {
                $oldValues = $model->toArray();
                unset($oldValues['created_at'], $oldValues['updated_at']);
            }

            // Écriture directe en désactivant temporairement tout risque de boucle d'observateur
            AuditLog::create([
                'company_id'     => $companyId,
                'branch_id'      => $branchId,
                'user_id'        => $userId,
                'user_role'      => $userRole,
                'auditable_type' => get_class($model),
                'auditable_id'   => $model->getKey(),
                'action'         => $action,
                'module'         => $module,
                'old_values'     => $oldValues,
                'new_values'     => $newValues,
                'ip_address'     => request()->ip(),
                'user_agent'     => $userAgent,
                'device'         => $device,
                'result'         => 'success',
                'created_at'     => now(),
            ]);
        } catch (\Exception $e) {
            // Silencieux pour ne pas bloquer les transactions métier en cas d'erreur de log
            \Illuminate\Support\Facades\Log::error('Audit Logging Failed: ' . $e->getMessage());
        }
    }
}
