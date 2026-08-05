<?php

namespace App\Services;

use App\Models\AccessControlLog;
use App\Models\User;
use Illuminate\Support\Facades\Request;

class AccessControlLogger
{
    /**
     * Log a security or access control action
     */
    public static function log(
        string $action,
        ?User $actor = null,
        ?User $targetUser = null,
        array $extra = []
    ): AccessControlLog {
        $actorUser = $actor ?: auth('sanctum')->user();
        $companyId = $actorUser?->company_id ?: ($targetUser?->company_id ?: null);

        return AccessControlLog::create([
            'company_id'          => $companyId,
            'actor_user_id'       => $actorUser?->id,
            'target_user_id'      => $targetUser?->id,
            'action'              => $action,
            'old_role_id'         => $extra['old_role_id'] ?? null,
            'new_role_id'         => $extra['new_role_id'] ?? null,
            'old_access_zone_id'  => $extra['old_access_zone_id'] ?? null,
            'new_access_zone_id'  => $extra['new_access_zone_id'] ?? null,
            'old_permissions'     => $extra['old_permissions'] ?? null,
            'new_permissions'     => $extra['new_permissions'] ?? null,
            'old_modules'         => $extra['old_modules'] ?? null,
            'new_modules'         => $extra['new_modules'] ?? null,
            'old_branches'        => $extra['old_branches'] ?? null,
            'new_branches'        => $extra['new_branches'] ?? null,
            'ip_address'          => Request::ip(),
            'user_agent'          => Request::userAgent(),
        ]);
    }
}
