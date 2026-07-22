<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;
use App\Traits\Auditable;

class Sale extends Model
{
    use BelongsToTenant, Auditable;

    protected $fillable = [
        'company_id',
        'branch_id',
        'cash_register_id',
        'terminal_id',
        'user_id',
        'cash_session_id',
        'customer_id',
        'sale_number',
        'client_name',
        'client_phone',
        'subtotal',
        'discount',
        'tax',
        'total',
        'payment_method',
        'payment_status',
        'amount_received',
        'amount_change',
        'notes',
    ];

    public function register()
    {
        return $this->belongsTo(CashRegister::class, 'cash_register_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function session()
    {
        return $this->belongsTo(CashSession::class, 'cash_session_id');
    }

    public function details()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
