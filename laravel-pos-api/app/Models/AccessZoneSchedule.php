<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessZoneSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'access_zone_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_active',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'is_active'   => 'boolean',
    ];

    public function accessZone()
    {
        return $this->belongsTo(AccessZone::class, 'access_zone_id');
    }
}
