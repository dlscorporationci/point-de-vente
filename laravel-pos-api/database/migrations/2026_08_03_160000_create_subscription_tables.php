<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Abonnements d'Entreprise
        if (!Schema::hasTable('company_subscriptions')) {
            Schema::create('company_subscriptions', function (Blueprint $table) {
                $table->id();
                $table->uuid('uuid')->unique();
                $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
                $table->foreignId('plan_id')->nullable()->constrained('subscription_plans')->onDelete('set null');
                $table->enum('billing_period', ['monthly', 'quarterly', 'semi_annual', 'annual', 'custom'])->default('monthly');
                $table->decimal('amount', 15, 2)->default(0);
                $table->string('currency', 10)->default('FCFA');
                $table->date('start_date');
                $table->date('end_date');
                $table->enum('status', ['trial', 'active', 'pending', 'expired', 'suspended', 'cancelled'])->default('active');
                $table->boolean('auto_renew')->default(true);
                $table->json('history')->nullable();
                $table->timestamps();
            });
        }

        // 2. Paiements d'Abonnement
        if (!Schema::hasTable('subscription_payments')) {
            Schema::create('subscription_payments', function (Blueprint $table) {
                $table->id();
                $table->uuid('uuid')->unique();
                $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
                $table->foreignId('subscription_id')->nullable()->constrained('company_subscriptions')->onDelete('cascade');
                $table->decimal('amount', 15, 2);
                $table->string('currency', 10)->default('FCFA');
                $table->enum('payment_method', ['cash', 'mobile_money', 'bank_transfer', 'card', 'cheque'])->default('mobile_money');
                $table->string('reference')->nullable();
                $table->enum('status', ['pending', 'paid', 'failed', 'cancelled', 'refunded'])->default('paid');
                $table->timestamp('payment_date')->useCurrent();
                $table->timestamp('validated_at')->nullable();
                $table->text('notes')->nullable();
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamps();
            });
        }

        // 3. Factures d'Abonnement
        if (!Schema::hasTable('subscription_invoices')) {
            Schema::create('subscription_invoices', function (Blueprint $table) {
                $table->id();
                $table->uuid('uuid')->unique();
                $table->string('invoice_number')->unique(); // ex: INV-2026-001
                $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
                $table->foreignId('subscription_id')->nullable()->constrained('company_subscriptions')->onDelete('set null');
                $table->foreignId('payment_id')->nullable()->constrained('subscription_payments')->onDelete('set null');
                $table->string('billing_period')->default('monthly');
                $table->decimal('subtotal', 15, 2)->default(0);
                $table->decimal('tax_amount', 15, 2)->default(0);
                $table->decimal('total_amount', 15, 2)->default(0);
                $table->enum('status', ['draft', 'issued', 'paid', 'partially_paid', 'overdue', 'cancelled'])->default('issued');
                $table->date('issue_date');
                $table->date('due_date');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_invoices');
        Schema::dropIfExists('subscription_payments');
        Schema::dropIfExists('company_subscriptions');
    }
};
