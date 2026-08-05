<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\EmailService;

class TestMailCommand extends Command
{
    protected $signature = 'apexpos:test-mail {--to=infos@dlscorporation.ci : Adresse e-mail destinataire pour le test}';
    protected $description = 'Tester la connectivité SMTP et l’envoi d’e-mail transactionnel ApexPOS';

    public function handle(EmailService $emailService): int
    {
        $recipient = $this->option('to');
        $this->info("Initialisation du test d'envoi SMTP vers : {$recipient}");

        try {
            $result = $emailService->sendTestEmail($recipient, sync: true);
            $this->info("✓ " . $result['message']);
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("✗ Échec de l'envoi d'e-mail SMTP : " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
