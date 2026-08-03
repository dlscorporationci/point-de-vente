<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'domain',
        'description',
        'icon',
        'image',
        'is_active',
        'is_system_template',
        'version',
    ];

    protected $casts = [
        'is_active'          => 'boolean',
        'is_system_template' => 'boolean',
    ];

    public function categories()
    {
        return $this->hasMany(CatalogTemplateCategory::class);
    }

    public function products()
    {
        return $this->hasMany(CatalogTemplateProduct::class);
    }
}
