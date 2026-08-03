<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use App\Traits\Auditable;
use Illuminate\Support\Str;

class GeneratedDocument extends Model
{
    use BelongsToTenant, Auditable;

    protected $fillable = [
        'uuid',
        'company_id',
        'branch_id',
        'user_id',
        'document_type',
        'template_id',
        'format',
        'title',
        'file_name',
        'file_path',
        'file_size',
        'filters',
        'metadata',
        'status',
    ];

    protected $casts = [
        'filters'  => 'array',
        'metadata' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($doc) {
            if (empty($doc->uuid)) {
                $doc->uuid = (string) Str::uuid();
            }
        });
    }

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
