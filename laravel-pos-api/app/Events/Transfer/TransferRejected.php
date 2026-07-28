<?php
namespace App\Events\Transfer;
use App\Models\StockTransfer;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
class TransferRejected {
    use Dispatchable;
    public function __construct(public readonly StockTransfer $transfer, public readonly User $actor) {}
}
