<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessControlLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'actor_user_id',
        'target_user_id',
        'action',
        'old_role_id',
        'new_role_id',
        'old_access_zone_id',
        'new_access_zone_id',
        'old_permissions',
        'new_permissions',
        'old_modules',
        'new_modules',
        'old_branches',
        'new_branches',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_permissions' => 'array',
        'new_permissions' => 'array',
        'old_modules'     => 'array',
        'new_modules'     => 'array',
        'old_branches'    => 'array',
        'new_branches'    => 'array',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }

    public function target()
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function oldRole()
    {
        return $this->belongsTo(Role::class, 'old_role_id');
    }

    public function newRole()
    {
        return $this->belongsTo(Role::class, 'new_role_id');
    }

    public function oldAccessZone()
    {
        return $this->belongsTo(AccessZone::class, 'old_access_zone_id');
    }

    public function newAccessZone()
    {
        return $this->belongsTo(AccessZone::class, 'new_access_zone_id');
    }
}
