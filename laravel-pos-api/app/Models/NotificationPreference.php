<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'user_id',
        'email_welcome',
        'email_password_security',
        'email_subscription',
        'email_payment',
        'email_maintenance',
        'email_security',
        'in_app_notifications',
    ];

    protected $casts = [
        'email_welcome'           => 'boolean',
        'email_password_security' => 'boolean',
        'email_subscription'      => 'boolean',
        'email_payment'           => 'boolean',
        'email_maintenance'       => 'boolean',
        'email_security'          => 'boolean',
        'in_app_notifications'    => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
