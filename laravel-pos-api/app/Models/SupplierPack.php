<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierPack extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'company_id',
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function types()
    {
        return $this->hasMany(SupplierType::class, 'pack_id');
    }
}
