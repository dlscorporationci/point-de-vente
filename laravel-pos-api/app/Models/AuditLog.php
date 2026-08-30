<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class AuditLog extends Model
{
    use BelongsToTenant;

    public $timestamps = false;

    protected $fillable = [
        'company_id',
        'branch_id',
        'user_id',
        'user_role',
        'auditable_type',
        'auditable_id',
        'action',
        'module',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'device',
        'result',
        'created_at',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function auditable()
    {
        return $this->morphTo();
    }

    public function setDeviceAttribute($value)
    {
        $this->attributes['device'] = substr($value ?? 'Web App', 0, 190);
    }

    public function setUserAgentAttribute($value)
    {
        $this->attributes['user_agent'] = substr($value ?? 'Web App', 0, 250);
    }
}
