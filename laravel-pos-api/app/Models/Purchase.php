<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;
use App\Traits\Auditable;

class Purchase extends Model
{
    use BelongsToTenant, Auditable;

    protected $fillable = [
        'company_id',
        'branch_id',
        'supplier_id',
        'purchase_number',
        'status',
        'payment_status',
        'subtotal',
        'tax_amount',
        'total_amount',
        'amount_paid',
        'notes',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function details()
    {
        return $this->hasMany(PurchaseDetail::class);
    }
}
