<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;
use App\Traits\Auditable;

class AccessZone extends Model
{
    use BelongsToTenant, Auditable;

    protected $fillable = [
        'company_id',
        'name',
        'slug',
        'description',
        'branch_ids',
        'allowed_modules',
        'is_active',
    ];

    protected $casts = [
        'branch_ids'      => 'array',
        'allowed_modules' => 'array',
        'is_active'        => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
