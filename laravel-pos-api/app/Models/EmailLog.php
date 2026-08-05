<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class EmailLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'company_id',
        'user_id',
        'recipient',
        'sender',
        'type',
        'subject',
        'status',
        'attempts',
        'message_id',
        'error_message',
        'metadata',
        'sent_at',
        'failed_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'sent_at'   => 'datetime',
        'failed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function company()
    {
        return $this->belongsTo(Company::class)->withoutGlobalScopes();
    }

    public function user()
    {
        return $this->belongsTo(User::class)->withoutGlobalScopes();
    }
}
