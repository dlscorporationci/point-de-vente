<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\Auditable;

class Company extends Model
{
    use Auditable;
    protected $fillable = [
        'name',
        'code',
        'timezone',
        'currency',
        'tax_settings',
        'status',
        'logo_path',
    ];

    protected $casts = [
        'tax_settings' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($company) {
            if (empty($company->code)) {
                $company->code = static::generateUniqueCode();
            }
        });
    }

    public static function generateUniqueCode(): string
    {
        do {
            $part1 = strtoupper(\Illuminate\Support\Str::random(4));
            $part2 = strtoupper(\Illuminate\Support\Str::random(4));
            $code = "{$part1}-{$part2}";
            $exists = static::where('code', $code)->exists();
        } while ($exists);

        return $code;
    }

    public function branches()
    {
        return $this->hasMany(Branch::class)->withoutGlobalScopes();
    }

    public function users()
    {
        return $this->hasMany(User::class)->withoutGlobalScopes();
    }
}
