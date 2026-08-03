<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogTemplateProduct extends Model
{
    protected $fillable = [
        'catalog_template_id',
        'category_name',
        'name',
        'sku',
        'barcode',
        'description',
        'unit',
        'selling_price',
        'cost_price',
        'tax_rate',
        'alert_quantity',
    ];

    public function template()
    {
        return $this->belongsTo(CatalogTemplate::class, 'catalog_template_id');
    }
}
