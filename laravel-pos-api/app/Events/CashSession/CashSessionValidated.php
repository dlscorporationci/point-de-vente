<?php
namespace App\Events\CashSession;
use App\Models\CashSession;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
class CashSessionValidated {
    use Dispatchable;
    public function __construct(
        public readonly CashSession $session,
        public readonly User $actor
    ) {}
}
