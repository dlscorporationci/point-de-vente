<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;

class SystemErrorLog extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'company_id',
        'branch_id',
        'user_id',
        'module',
        'error_message',
        'stack_trace',
        'ip_address',
        'user_agent',
        'device',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
