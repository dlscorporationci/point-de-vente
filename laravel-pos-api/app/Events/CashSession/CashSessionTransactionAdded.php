<?php
namespace App\Events\CashSession;
use App\Models\CashSession;
use App\Models\CashSessionTransaction;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
class CashSessionTransactionAdded {
    use Dispatchable;
    public function __construct(
        public readonly CashSession $session,
        public readonly CashSessionTransaction $transaction,
        public readonly User $actor
    ) {}
}
