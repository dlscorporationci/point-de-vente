<?php

namespace App\Services;

use App\Models\User;
use App\Models\Branch;
use App\Models\AccessZone;
use Illuminate\Support\Carbon;

class AuthorizationService
{
    /**
     * Module alias mapping table to ensure smooth cross-module authorization
     */
    protected array $moduleAliases = [
        'stocks'        => ['catalog'],
        'catalog'       => ['stocks'],
        'sale'          => ['sales', 'pos'],
        'sales'         => ['pos', 'sale'],
        'cash-sessions' => ['pos'],
        'pos'           => ['sales', 'sale', 'cash-sessions'],
        'suppliers'     => ['purchases'],
        'purchases'     => ['suppliers'],
        'customers'     => ['pos', 'sales', 'sale'],
    ];

    /**
     * Verifies if a user is super-admin.
     *
     * SOURCE DE VÉRITÉ UNIQUE (RISK-2.0-04) :
     * L'appartenance au rôle super-admin repose UNIQUEMENT sur le slug RBAC
     * et le flag `is_superadmin`. Aucune vérification d'adresse email en dur
     * n'est tolérée afin d'éviter toute incohérence si les données changent.
     *
     * Tout autre composant (TenantScopeMiddleware, contrôleurs, etc.)
     * DOIT appeler cette méthode plutôt que dupliquer la logique.
     */
    public function isSuperAdmin(?User $user): bool
    {
        if (!$user) return false;
        $slug = is_object($user->role) ? ($user->role->slug ?? '') : '';
        return in_array($slug, ['super-admin', 'superadmin']) ||
            !empty($user->is_superadmin);
    }

    /**
     * Checks if a user has access to a specific top-level module key
     */
    public function canAccessModule(?User $user, string $moduleKey): bool
    {
        if (!$user) return false;
        if ($this->isSuperAdmin($user)) return true;

        // Admin role has full module access by default
        $role = $user->role ?: ($user->role_id ? \App\Models\Role::withoutGlobalScopes()->find($user->role_id) : null);
        $roleSlug = $role ? ($role->slug ?? $role->name ?? '') : '';
        if ($roleSlug === 'admin' || $roleSlug === 'Administrateur Entreprise') {
            return true;
        }

        // Always allowed system tabs
        $alwaysAllowed = ['home', 'dashboard', 'auth', 'userguide', 'notifications', 'sync-center', 'select-branch'];
        if (in_array($moduleKey, $alwaysAllowed)) {
            return true;
        }

        // Check user's Access Zone
        $accessZone = $user->accessZone ?? ($user->access_zone_id ? AccessZone::find($user->access_zone_id) : null);
        if (!$accessZone) {
            return true; // No access zone restriction set = full access
        }

        $allowedModules = $accessZone->allowed_modules ?? [];
        if (empty($allowedModules) || !is_array($allowedModules)) {
            return true;
        }

        if (in_array($moduleKey, $allowedModules)) {
            return true;
        }

        // Check alias rules
        if (isset($this->moduleAliases[$moduleKey])) {
            foreach ($this->moduleAliases[$moduleKey] as $alias) {
                if (in_array($alias, $allowedModules)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Checks if a user can access a specific branch ID
     */
    public function canAccessBranch(?User $user, int|string $branchId): bool
    {
        if (!$user) return false;
        if ($this->isSuperAdmin($user)) return true;

        $branchIdInt = (int) $branchId;
        if ($branchIdInt <= 0) return true;

        // Verify branch belongs to the user's company
        $branch = Branch::withoutGlobalScopes()->find($branchIdInt);
        if (!$branch || ($user->company_id && (int)$branch->company_id !== (int)$user->company_id)) {
            return false;
        }

        // If user has access zone branch restrictions
        $accessZone = $user->accessZone ?? ($user->access_zone_id ? AccessZone::find($user->access_zone_id) : null);
        if ($accessZone && !empty($accessZone->branch_ids) && is_array($accessZone->branch_ids)) {
            $allowedBranchIds = array_map('intval', $accessZone->branch_ids);
            if (!in_array($branchIdInt, $allowedBranchIds)) {
                return false;
            }
        }

        // Also check direct user_branches relation if assigned
        $assignedBranchIds = $user->assignedBranches()->pluck('branches.id')->toArray();
        if (!empty($assignedBranchIds) && !in_array($branchIdInt, $assignedBranchIds)) {
            if ($user->branch_id && (int)$user->branch_id === $branchIdInt) {
                return true;
            }
            return false;
        }

        return true;
    }

    /**
     * Checks if current time is within allowed Access Zone schedules
     */
    public function isWithinAllowedSchedule(?User $user): bool
    {
        if (!$user) return false;
        if ($this->isSuperAdmin($user)) return true;

        $accessZone = $user->accessZone ?? ($user->access_zone_id ? AccessZone::find($user->access_zone_id) : null);
        if (!$accessZone) return true;

        $schedules = $accessZone->schedules()->where('is_active', true)->get();
        if ($schedules->isEmpty()) {
            return true; // No time restrictions defined = 24/7 allowed
        }

        $now = Carbon::now();
        $dayOfWeek = $now->dayOfWeekIso; // 1 (Monday) to 7 (Sunday)
        $currentTimeStr = $now->format('H:i:s');

        $daySchedule = $schedules->firstWhere('day_of_week', $dayOfWeek);
        if (!$daySchedule) {
            return false; // Day not configured = access closed on this day
        }

        return $currentTimeStr >= $daySchedule->start_time && $currentTimeStr <= $daySchedule->end_time;
    }

    /**
     * Checks if a user has a specific granular permission slug
     */
    public function hasPermission(?User $user, string $permissionSlug): bool
    {
        if (!$user) return false;
        if ($this->isSuperAdmin($user)) return true;

        $roleSlug = $user->role ? ($user->role->slug ?? $user->role->name ?? '') : '';
        if (in_array(strtolower($roleSlug), ['admin', 'administrateur entreprise', 'super-admin'])) {
            return true;
        }

        // Retrieve user permissions list (loaded directly or via role)
        $userPermissions = $user->permissions;
        if (is_array($userPermissions) && in_array($permissionSlug, $userPermissions)) {
            return true;
        }

        if ($user->relationLoaded('role') && $user->role) {
            $rolePerms = $user->role->permissions()->pluck('slug')->toArray();
            if (in_array($permissionSlug, $rolePerms)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Evaluates the complete authorization chain
     */
    public function authorize(?User $user, string $moduleKey, ?string $permissionSlug = null, int|string|null $branchId = null): array
    {
        if (!$user) {
            return ['allowed' => false, 'code' => 401, 'message' => 'Accès refusé. Authentification requise.'];
        }

        if ($this->isSuperAdmin($user)) {
            return ['allowed' => true];
        }

        // 1. Module Access Check
        if (!$this->canAccessModule($user, $moduleKey)) {
            return ['allowed' => false, 'code' => 403, 'message' => "Accès refusé. Le module '{$moduleKey}' n'est pas autorisé dans votre périmètre de Zone d'Accès."];
        }

        // 2. Branch Access Check
        if ($branchId !== null && !$this->canAccessBranch($user, $branchId)) {
            return ['allowed' => false, 'code' => 403, 'message' => "Accès refusé. La boutique #{$branchId} ne fait pas partie de votre périmètre autorisé."];
        }

        // 3. Temporal Schedule Check
        if (!$this->isWithinAllowedSchedule($user)) {
            return ['allowed' => false, 'code' => 403, 'message' => "Accès refusé. Vos droits d'accès sont restreints à des plages horaires spécifiques et le service est actuellement fermé."];
        }

        // 4. Granular Permission Check
        if ($permissionSlug !== null && !$this->hasPermission($user, $permissionSlug)) {
            return ['allowed' => false, 'code' => 403, 'message' => "Accès refusé. La permission '{$permissionSlug}' est requise pour exécuter cette opération."];
        }

        return ['allowed' => true];
    }
}
