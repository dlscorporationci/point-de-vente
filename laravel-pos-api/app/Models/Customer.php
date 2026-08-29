<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use BelongsToTenant, Auditable, SoftDeletes;

    protected $fillable = [
        'company_id',
        'branch_id',
        'name',
        'email',
        'phone',
        'address',
        'credit_limit',
        'debt_balance',
        'loyalty_points',
    ];

    protected $casts = [
        'credit_limit'   => 'float',
        'debt_balance'   => 'float',
        'loyalty_points' => 'integer',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'customer_branches')->withTimestamps();
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
