<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'company_id',
        'plan_id',
        'billing_period',
        'amount',
        'currency',
        'start_date',
        'end_date',
        'status',
        'auto_renew',
        'history',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'auto_renew' => 'boolean',
        'history'    => 'array',
        'amount'     => 'float',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function payments()
    {
        return $this->hasMany(SubscriptionPayment::class, 'subscription_id');
    }

    public function invoices()
    {
        return $this->hasMany(SubscriptionInvoice::class, 'subscription_id');
    }
}
