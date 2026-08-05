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
    /**
     * Enregistrer l'événement d'audit (Supporte les Modèles Eloquent et les Actions Manuelles).
     */
    protected static function logAuditEvent($modelOrAction, $actionOrDetails = 'updated', $extraDetails = null): void
    {
        try {
            $tenantManager = app(TenantManager::class);
            $user = auth('sanctum')->user() ?: auth()->user();

            if ($modelOrAction instanceof Model) {
                $model = $modelOrAction;
                $action = is_string($actionOrDetails) ? $actionOrDetails : 'updated';
                $companyId = $tenantManager->getCompanyId() ?: ($model->company_id ?? ($user ? $user->company_id : null));
                $branchId = $tenantManager->getBranchId() ?: ($model->branch_id ?? ($user ? $user->branch_id : null));
                $module = class_basename($model);
                $auditableType = get_class($model);
                $auditableId = $model->getKey();

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
                        return; // Pas de modifications significatives
                    }
                } elseif ($action === 'created') {
                    $newValues = $model->toArray();
                    unset($newValues['created_at'], $newValues['updated_at']);
                } elseif ($action === 'deleted') {
                    $oldValues = $model->toArray();
                    unset($oldValues['created_at'], $oldValues['updated_at']);
                }
            } else {
                // Événement d'audit manuel personnalisé avec action chaîne
                $action = (string) $modelOrAction;
                $companyId = $tenantManager->getCompanyId() ?: ($user ? $user->company_id : null);
                $branchId = $tenantManager->getBranchId() ?: ($user ? $user->branch_id : null);
                $module = 'System';
                $auditableType = 'CustomAction';
                $auditableId = 0;
                $oldValues = null;
                $newValues = is_array($actionOrDetails) ? $actionOrDetails : (is_array($extraDetails) ? $extraDetails : null);
            }

            if (!$companyId) {
                return; // Impossible de logger sans identifiant de compagnie
            }

            $userId = $user ? $user->id : null;
            $userRole = ($user && $user->role) ? (is_object($user->role) ? $user->role->slug : $user->role) : null;

            $userAgent = request()->userAgent();
            $device = 'Web App';
            if ($userAgent) {
                if (str_contains($userAgent, 'Mobile') || str_contains($userAgent, 'Android') || str_contains($userAgent, 'iPhone')) {
                    $device = 'Mobile App / Browser';
                } elseif (str_contains($userAgent, 'Postman') || str_contains($userAgent, 'curl')) {
                    $device = 'API Client';
                }
            }

            AuditLog::create([
                'company_id'     => $companyId,
                'branch_id'      => $branchId,
                'user_id'        => $userId,
                'user_role'      => $userRole,
                'auditable_type' => $auditableType,
                'auditable_id'   => $auditableId,
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
