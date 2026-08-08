<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\EmailService;
use App\Models\Company;
use App\Models\User;
use App\Models\SystemMaintenance;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendMaintenanceEmailsCommand extends Command
{
    protected $signature = 'apexpos:send-maintenance-emails {--type=global} {--company_id=} {--enabled=1} {--message=}';
    protected $description = 'Envoyer les e-mails de notification de maintenance système en tâche de fond CLI';

    public function handle(EmailService $emailService): int
    {
        $type = $this->option('type') ?: 'global';
        $companyId = $this->option('company_id') ? (int)$this->option('company_id') : null;
        $enabled = (bool)((int)$this->option('enabled'));
        $message = $this->option('message') ?: null;

        $maint = SystemMaintenance::where('type', $type)
            ->where('company_id', $companyId)
            ->first();

        $status = $enabled ? 'started' : 'completed';
        $title = $enabled ? 'Intervention de Maintenance Système SaaS' : '🎉 Fin de l\'Intervention de Maintenance DLS POS';
        $endsAtStr = ($maint && $maint->estimated_end_at) ? Carbon::parse($maint->estimated_end_at)->format('d/m/Y H:i') : null;
        $startsAtStr = ($maint && $maint->started_at) ? Carbon::parse($maint->started_at)->format('d/m/Y H:i') : null;
        $mailBody = $enabled 
            ? ($message ?: 'Une intervention de maintenance est actuellement en cours sur la plateforme DLS POS.')
            : 'Nous vous informons que la maintenance système est officiellement terminée. La plateforme DLS POS est de nouveau disponible et pleinement fonctionnelle pour toutes vos opérations.';

        $companies = ($type === 'global') ? Company::all() : ($companyId ? Company::where('id', $companyId)->get() : collect());

        foreach ($companies as $comp) {
            try {
                $users = User::withoutGlobalScopes()
                    ->where('company_id', $comp->id)
                    ->where('status', 'active')
                    ->get();

                $recipients = [];
                foreach ($users as $uItem) {
                    if (!empty($uItem->email)) {
                        $recipients[] = trim($uItem->email);
                    }
                }
                if (!empty($comp->email) && !in_array(trim($comp->email), $recipients)) {
                    $recipients[] = trim($comp->email);
                }

                foreach (array_unique($recipients) as $recipientEmail) {
                    try {
                        $emailService->sendMaintenanceNotificationEmail(
                            recipient: $recipientEmail,
                            title: $title,
                            messageBody: $mailBody,
                            status: $status,
                            startsAt: $startsAtStr,
                            endsAt: $endsAtStr,
                            companyId: $comp->id
                        );
                        Log::info("E-mail de maintenance envoyé à {$recipientEmail} (Entreprise #{$comp->id})");
                    } catch (\Throwable $ex) {
                        Log::warning("Échec envoi mail maintenance à {$recipientEmail} : " . $ex->getMessage());
                    }
                }
            } catch (\Throwable $ex) {
                Log::warning("Échec envoi mails maintenance entreprise ID {$comp->id} : " . $ex->getMessage());
            }
        }

        return Command::SUCCESS;
    }
}
