<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserBranch extends Model
{
    protected $table = 'user_branches';

    protected $fillable = [
        'user_id',
        'branch_id',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
