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

#[Fillable(['company_id', 'branch_id', 'role_id', 'name', 'email', 'password', 'pin_code', 'status'])]
#[Hidden(['password', 'remember_token', 'pin_code'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, BelongsToTenant, Auditable;

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
        return $this->belongsTo(Role::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'user_branches')
                    ->withPivot('permissions')
                    ->withTimestamps();
    }

    /**
     * Obtenir toutes les boutiques accessibles par l'utilisateur.
     * Pour les super-admins ou admins d'entreprise, renvoie toutes les boutiques de l'entreprise.
     */
    public function assignedBranches()
    {
        if ($this->role && in_array($this->role->slug, ['super-admin', 'admin'])) {
            return Branch::where('company_id', $this->company_id)->get();
        }

        $assigned = $this->branches;
        if ($assigned->isEmpty() && $this->branch_id) {
            $primary = Branch::find($this->branch_id);
            return $primary ? collect([$primary]) : collect([]);
        }

        return $assigned;
    }

    /**
     * Vérifier si l'utilisateur a accès à une boutique spécifique.
     */
    public function hasAccessToBranch($branchId): bool
    {
        if (!$branchId) return false;
        
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
     * Check if the user has a specific permission.
     */
    public function hasPermission(string $permissionSlug): bool
    {
        if ($this->role_id === null) {
            return false;
        }

        // Si c'est le super-admin (slug 'super-admin'), il a toutes les permissions
        if ($this->role && $this->role->slug === 'super-admin') {
            return true;
        }

        return $this->role->hasPermission($permissionSlug);
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
