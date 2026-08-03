<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierType extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'company_id',
        'pack_id',
        'name',
        'code',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function pack()
    {
        return $this->belongsTo(SupplierPack::class, 'pack_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'supplier_type_categories', 'supplier_type_id', 'category_id');
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class, 'supplier_type_id');
    }
}
