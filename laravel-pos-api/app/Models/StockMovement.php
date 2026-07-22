<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;
use App\Traits\Auditable;

class StockMovement extends Model
{
    use BelongsToTenant, Auditable;

    protected $fillable = [
        'company_id',
        'branch_id',
        'product_id',
        'quantity',
        'type',
        'reference_id',
        'description',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
