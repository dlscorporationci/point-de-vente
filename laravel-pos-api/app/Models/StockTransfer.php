<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;
use App\Traits\Auditable;

class StockTransfer extends Model
{
    use BelongsToTenant, Auditable;

    protected $fillable = [
        'company_id',
        'from_branch_id',
        'to_branch_id',
        'transfer_number',
        'status',
        'notes',
    ];

    public function fromBranch()
    {
        return $this->belongsTo(Branch::class, 'from_branch_id');
    }

    public function toBranch()
    {
        return $this->belongsTo(Branch::class, 'to_branch_id');
    }

    public function details()
    {
        return $this->hasMany(StockTransferDetail::class);
    }
}
