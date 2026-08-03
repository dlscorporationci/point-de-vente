<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'invoice_number',
        'company_id',
        'subscription_id',
        'payment_id',
        'billing_period',
        'subtotal',
        'tax_amount',
        'total_amount',
        'status',
        'issue_date',
        'due_date',
    ];

    protected $casts = [
        'subtotal'     => 'float',
        'tax_amount'   => 'float',
        'total_amount' => 'float',
        'issue_date'   => 'date',
        'due_date'     => 'date',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function subscription()
    {
        return $this->belongsTo(CompanySubscription::class, 'subscription_id');
    }

    public function payment()
    {
        return $this->belongsTo(SubscriptionPayment::class, 'payment_id');
    }
}
