<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToCompany;
use App\Traits\Auditable;

class BusinessRule extends Model
{
    use BelongsToCompany, Auditable;

    protected $fillable = [
        'company_id',
        'branch_id',
        'rule_key',
        'rule_value',
        'value_type',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
