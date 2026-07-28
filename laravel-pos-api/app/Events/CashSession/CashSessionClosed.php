<?php
namespace App\Events\CashSession;
use App\Models\CashSession;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
class CashSessionClosed {
    use Dispatchable;
    public function __construct(
        public readonly CashSession $session,
        public readonly User $actor,
        public readonly float $gap  // Écart caisse (théorique - compté)
    ) {}
}
