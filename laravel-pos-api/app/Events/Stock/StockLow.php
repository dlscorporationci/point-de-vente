<?php
namespace App\Events\Stock;
use Illuminate\Foundation\Events\Dispatchable;
class StockLow {
    use Dispatchable;
    public function __construct(
        public readonly int $companyId,
        public readonly int $branchId,
        public readonly int $productId,
        public readonly string $productName,
        public readonly float $currentQuantity,
        public readonly float $alertQuantity
    ) {}
}
