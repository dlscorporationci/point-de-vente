<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use App\Traits\Auditable;

class CashRegister extends Model
{
    use BelongsToTenant, Auditable;

    protected $fillable = [
        'company_id',
        'branch_id',
        'name',
        'code',
        'status',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function sessions()
    {
        return $this->hasMany(CashSession::class);
    }
}
