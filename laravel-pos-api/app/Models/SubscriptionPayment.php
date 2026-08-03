<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'company_id',
        'subscription_id',
        'amount',
        'currency',
        'payment_method',
        'reference',
        'status',
        'payment_date',
        'validated_at',
        'notes',
        'user_id',
    ];

    protected $casts = [
        'amount'       => 'float',
        'payment_date' => 'datetime',
        'validated_at' => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function subscription()
    {
        return $this->belongsTo(CompanySubscription::class, 'subscription_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
