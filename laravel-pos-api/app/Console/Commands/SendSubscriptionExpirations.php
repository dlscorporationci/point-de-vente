<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Company;
use App\Services\EmailService;
use App\Services\NotificationService;
use Carbon\Carbon;

class SendSubscriptionExpirations extends Command
{
    protected $signature = 'apexpos:send-expiration-reminders';
    protected $description = 'Vérifier et envoyer les rappels d’expiration d’abonnement (J-7, J-3, J-1 et expiré) de manière idempotente.';

    public function handle(EmailService $emailService): int
    {
        $this->info('Vérification des expirations d’abonnements ApexPOS...');

        $activeCompanies = Company::where('status', 'active')->get();
        $sentCount = 0;

        foreach ($activeCompanies as $company) {
            if (!$company->subscription_expires_at) {
                continue;
            }

            $expiresAt = Carbon::parse($company->subscription_expires_at);
            $now = Carbon::now();

            if ($expiresAt->isPast()) {
                // Abonnements expirés
                $emailService->sendSubscriptionExpiredEmail(
                    company: $company,
                    expiredAt: $expiresAt->format('d/m/Y')
                );

                NotificationService::send(
                    companyId: $company->id,
                    branchId: null,
                    userId: null,
                    type: 'subscription',
                    title: '🔴 Abonnement expiré',
                    message: "L'abonnement de votre entreprise a expiré le {$expiresAt->format('d/m/Y')}. Veuillez régulariser pour rétablir les accès.",
                    priority: 'critical',
                    targetRoute: '/settings'
                );

                $sentCount++;
                continue;
            }

            $diffInDays = (int) ceil($now->diffInDays($expiresAt, false));

            if (in_array($diffInDays, [7, 3, 1])) {
                $emailService->sendSubscriptionExpiringEmail(
                    company: $company,
                    daysRemaining: $diffInDays,
                    expiresAt: $expiresAt->format('d/m/Y')
                );

                NotificationService::send(
                    companyId: $company->id,
                    branchId: null,
                    userId: null,
                    type: 'subscription',
                    title: "⚠️ Expiration dans {$diffInDays} jour(s)",
                    message: "Votre abonnement ApexPOS expire le {$expiresAt->format('d/m/Y')}. Renouvelez-le dès maintenant.",
                    priority: $diffInDays === 1 ? 'critical' : 'warning',
                    targetRoute: '/settings'
                );

                $sentCount++;
            }
        }

        $this->info("Rappels d'expiration traités avec succès ({$sentCount} notification(s)/e-mail(s) évalués).");
        return Command::SUCCESS;
    }
}
