<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogTemplateCategory extends Model
{
    protected $fillable = [
        'catalog_template_id',
        'name',
        'parent_id',
        'icon',
    ];

    public function template()
    {
        return $this->belongsTo(CatalogTemplate::class, 'catalog_template_id');
    }

    public function parent()
    {
        return $this->belongsTo(CatalogTemplateCategory::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(CatalogTemplateCategory::class, 'parent_id');
    }
}
