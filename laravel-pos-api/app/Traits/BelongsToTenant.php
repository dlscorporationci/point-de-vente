<?php

namespace App\Traits;

use App\Services\TenantManager;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait BelongsToTenant
{
    /**
     * Boot the trait to apply the tenant global scope and auto-set company_id.
     */
    protected static function bootBelongsToTenant(): void
    {
        // 1. Définition du Global Scope pour filtrer par company_id
        static::addGlobalScope('tenant', function (Builder $builder) {
            $tenantManager = app(TenantManager::class);
            if ($tenantManager->getCompanyId()) {
                $builder->where('company_id', $tenantManager->getCompanyId());
            }
        });

        // 2. Événement de création : Remplissage automatique du company_id
        static::creating(function (Model $model) {
            $tenantManager = app(TenantManager::class);
            if ($tenantManager->getCompanyId() && !$model->company_id) {
                $model->company_id = $tenantManager->getCompanyId();
            }
        });
    }
}
