<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;
use Illuminate\Support\Str;

class CommunicationLog extends Model
{
    use Auditable;

    protected $fillable = [
        'uuid',
        'company_id',
        'branch_id',
        'user_id',
        'sender_id',
        'channel',
        'subject',
        'message',
        'status',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($log) {
            if (empty($log->uuid)) {
                $log->uuid = (string) Str::uuid();
            }
            if (empty($log->sent_at)) {
                $log->sent_at = now();
            }
        });
    }

    public function company()
    {
        return $this->belongsTo(Company::class)->withoutGlobalScopes();
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class)->withoutGlobalScopes();
    }

    public function user()
    {
        return $this->belongsTo(User::class)->withoutGlobalScopes();
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id')->withoutGlobalScopes();
    }
}
