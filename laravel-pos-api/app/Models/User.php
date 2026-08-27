<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Traits\Auditable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\BelongsToTenant;

#[Fillable(['company_id', 'branch_id', 'access_zone_id', 'role_id', 'name', 'email', 'password', 'pin_code', 'status', 'google_id', 'google_email', 'google_avatar', 'google_verified_at'])]
#[Hidden(['password', 'remember_token', 'pin_code'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, BelongsToTenant, Auditable;

    protected $appends = ['has_pin'];

    public function getHasPinAttribute(): bool
    {
        return !empty($this->attributes['pin_code']);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'pin_code' => 'hashed',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class)->withoutGlobalScopes();
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class)->withoutGlobalScopes();
    }

    public function accessZone()
    {
        return $this->belongsTo(AccessZone::class, 'access_zone_id');
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'user_branches')
                    ->withoutGlobalScopes()
                    ->withPivot('permissions')
                    ->withTimestamps();
    }

    /**
     * Obtenir toutes les boutiques accessibles par l'utilisateur.
     * Pour les super-admins ou admins d'entreprise, renvoie toutes les boutiques de l'entreprise.
     * Si une zone d'accès filtre les boutiques, restreindre selon branch_ids de la zone.
     */
    public function assignedBranches()
    {
        $all = null;
        if ($this->role && in_array($this->role->slug, ['super-admin', 'admin'])) {
            $all = Branch::where('company_id', $this->company_id)->get();
        } else {
            $assigned = $this->branches;
            if ($assigned->isEmpty() && $this->branch_id) {
                $primary = Branch::find($this->branch_id);
                $all = $primary ? collect([$primary]) : collect([]);
            } else {
                $all = $assigned;
            }
        }

        // Si l'utilisateur est soumis à une zone d'accès restreinte sur certaines boutiques
        if ($this->accessZone && !empty($this->accessZone->branch_ids)) {
            $allowedBranchIds = array_map('intval', $this->accessZone->branch_ids);
            return $all->filter(fn($b) => in_array(intval($b->id), $allowedBranchIds))->values();
        }

        return $all;
    }

    /**
     * Vérifier si l'utilisateur a accès à une boutique spécifique.
     */
    public function hasAccessToBranch($branchId): bool
    {
        if (!$branchId) return false;

        // Restriction prioritaire de la zone d'accès
        if ($this->accessZone && !empty($this->accessZone->branch_ids)) {
            $allowedBranchIds = array_map('intval', $this->accessZone->branch_ids);
            if (!in_array(intval($branchId), $allowedBranchIds)) {
                return false;
            }
        }
        
        if ($this->role && in_array($this->role->slug, ['super-admin', 'admin'])) {
            $branch = Branch::find($branchId);
            return $branch && ($this->role->slug === 'super-admin' || $branch->company_id === $this->company_id);
        }

        if (intval($this->branch_id) === intval($branchId)) {
            return true;
        }

        return $this->branches()->where('branches.id', $branchId)->exists();
    }

    /**
     * Vérifier si un module de la plateforme est autorisé pour cet utilisateur.
     */
    public function isModuleAllowed(string $module): bool
    {
        if ($this->role && in_array($this->role->slug, ['super-admin', 'admin'])) {
            return true;
        }

        if (!$this->accessZone || empty($this->accessZone->allowed_modules)) {
            return true;
        }

        return in_array($module, $this->accessZone->allowed_modules);
    }

    /**
     * Check if the user has a specific permission.
     */
    public function hasPermission(string $permissionSlug): bool
    {
        return app(\App\Services\AuthorizationService::class)->hasPermission($this, $permissionSlug);
    }

    /**
     * Check if the user has a specific permission for a specific branch.
     */
    public function hasBranchPermission(string $permissionSlug, $branchId = null): bool
    {
        if (!$this->hasPermission($permissionSlug)) {
            return false;
        }

        if (!$branchId) {
            return true;
        }

        if ($this->role && in_array($this->role->slug, ['super-admin', 'admin'])) {
            return true;
        }

        $pivot = $this->branches()->where('branches.id', $branchId)->first();
        if ($pivot && !empty($pivot->pivot->permissions)) {
            $perms = is_array($pivot->pivot->permissions) ? $pivot->pivot->permissions : json_decode($pivot->pivot->permissions, true);
            if (is_array($perms) && count($perms) > 0) {
                return in_array($permissionSlug, $perms);
            }
        }

        return true;
    }
}
