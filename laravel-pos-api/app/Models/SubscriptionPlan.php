<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price_monthly',
        'price_yearly',
        'max_branches',
        'max_users',
        'max_products',
        'features',
        'is_active',
        'is_popular',
    ];

    protected $casts = [
        'features'      => 'array',
        'is_active'     => 'boolean',
        'is_popular'    => 'boolean',
        'price_monthly' => 'float',
        'price_yearly'  => 'float',
        'max_branches'  => 'integer',
        'max_users'     => 'integer',
        'max_products'  => 'integer',
    ];
}
