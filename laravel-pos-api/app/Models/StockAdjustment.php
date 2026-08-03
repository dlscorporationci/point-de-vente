<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockAdjustment extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'company_id',
        'branch_id',
        'product_id',
        'user_id',
        'type',
        'previous_quantity',
        'quantity_change',
        'new_quantity',
        'reason_code',
        'comment',
        'reference',
    ];

    protected $casts = [
        'previous_quantity' => 'float',
        'quantity_change'   => 'float',
        'new_quantity'       => 'float',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
