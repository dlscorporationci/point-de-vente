<?php
namespace App\Events\Purchase;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
class PurchaseReceived {
    use Dispatchable;
    public function __construct(
        public readonly Purchase $purchase,
        public readonly User $actor
    ) {}
}
