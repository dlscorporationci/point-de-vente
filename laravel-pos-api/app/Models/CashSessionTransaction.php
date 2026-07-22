<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\Auditable;

class CashSessionTransaction extends Model
{
    use Auditable;
    protected $fillable = [
        'cash_session_id',
        'type',
        'amount',
        'description',
    ];

    public function session()
    {
        return $this->belongsTo(CashSession::class, 'cash_session_id');
    }
}
