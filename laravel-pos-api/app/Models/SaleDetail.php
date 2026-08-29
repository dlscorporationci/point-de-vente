<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{
    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'selling_price',
        'discount',
        'tax',
        'total',
    ];

    protected $casts = [
        'quantity'       => 'integer',
        'selling_price'  => 'float',
        'discount'       => 'float',
        'tax'            => 'float',
        'total'          => 'float',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
