<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;
use Illuminate\Support\Str;

class MaintenanceMode extends Model
{
    use Auditable;

    protected $fillable = [
        'uuid',
        'type',
        'enabled',
        'company_id',
        'branch_id',
        'message',
        'started_at',
        'estimated_end_at',
        'ended_at',
        'created_by',
    ];

    protected $casts = [
        'enabled'          => 'boolean',
        'started_at'       => 'datetime',
        'estimated_end_at' => 'datetime',
        'ended_at'         => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($m) {
            if (empty($m->uuid)) {
                $m->uuid = (string) Str::uuid();
            }
        });
    }

    public function company()
    {
        return $this->belongsTo(Company::class)->withoutGlobalScopes();
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class)->withoutGlobalScopes();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')->withoutGlobalScopes();
    }
}
