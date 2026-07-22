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
        'name',
        'email',
        'phone',
        'address',
        'credit_limit',
        'debt_balance',
        'loyalty_points',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
