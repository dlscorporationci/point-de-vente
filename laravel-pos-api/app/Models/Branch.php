<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;

use App\Traits\Auditable;

use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use BelongsToTenant, Auditable, SoftDeletes;

    protected $fillable = [
        'company_id',
        'name',
        'type',
        'is_warehouse',
        'address',
        'phone',
        'status',
        'settings',
    ];

    protected $casts = [
        'is_warehouse' => 'boolean',
        'settings' => 'array',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_branches')->withTimestamps();
    }

    public function cashRegisters()
    {
        return $this->hasMany(CashRegister::class);
    }
}
