<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;
use App\Traits\Auditable;

class CashSession extends Model
{
    use BelongsToTenant, Auditable;

    protected $fillable = [
        'company_id',
        'branch_id',
        'cash_register_id',
        'terminal_id',
        'user_id',
        'opening_balance',
        'closing_balance',
        'theoretical_balance',
        'status',
        'opened_at',
        'closed_at',
        'notes',
        'validated_by',
        'validated_at',
        'validation_notes',
    ];

    public function register()
    {
        return $this->belongsTo(CashRegister::class, 'cash_register_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function validatedBy()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public function transactions()
    {
        return $this->hasMany(CashSessionTransaction::class);
    }
}
