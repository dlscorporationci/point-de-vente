<?php

namespace App\Services;

use App\Models\User;
use App\Models\Company;
use App\Models\EmailLog;
use App\Jobs\SendEmailJob;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApexPosGenericMail;
use Exception;

class EmailService
{
    /**
     * E-mail de bienvenue après inscription.
     */
    public function sendWelcomeEmail(User $user, ?Company $company = null): EmailLog
    {
        $companyData = $company ? [
            'name'              => $company->name,
            'code'              => $company->code,
            'subscription_plan' => $company->subscription_plan,
        ] : [];

        return $this->dispatchEmail(
            recipient: $user->email,
            subject: 'Bienvenue sur dls POS !',
            viewName: 'emails.auth.welcome',
            viewData: [
                'user'    => ['name' => $user->name, 'email' => $user->email],
                'company' => $companyData,
            ],
            type: 'WELCOME',
            companyId: $company?->id,
            userId: $user->id
        );
    }

    /**
     * E-mail de vérification d'adresse e-mail et activation de compte.
     */
    public function sendVerificationEmail(User $user, string $tokenPlainText): EmailLog
    {
        $frontendUrl = config('app.frontend_url') ?: 'http://localhost:5173';
        $verificationUrl = rtrim($frontendUrl, '/') . "/verify-email?token=" . urlencode($tokenPlainText) . "&email=" . urlencode($user->email);

        return $this->dispatchEmail(
            recipient: $user->email,
            subject: '✉️ Vérification de votre adresse e-mail ApexPOS',
            viewName: 'emails.auth.verify-email',
            viewData: [
                'user'            => ['name' => $user->name, 'email' => $user->email],
                'verificationUrl' => $verificationUrl,
                'token'           => $tokenPlainText,
            ],
            type: 'EMAIL_VERIFICATION',
            companyId: $user->company_id,
            userId: $user->id
        );
    }

    /**
     * E-mail de réinitialisation de mot de passe avec lien sécurisé.
     */
    public function sendPasswordResetEmail(User $user, string $token): EmailLog
    {
        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173'));
        $resetUrl = rtrim($frontendUrl, '/') . "/reset-password?token=" . urlencode($token) . "&email=" . urlencode($user->email);

        return $this->dispatchEmail(
            recipient: $user->email,
            subject: "🔑 Réinitialisation de votre mot de passe dls POS",
            viewName: 'emails.auth.password-reset',
            viewData: [
                'user'     => ['name' => $user->name, 'email' => $user->email],
                'token'    => $token,
                'resetUrl' => $resetUrl,
            ],
            type: 'PASSWORD_RESET',
            companyId: $user->company_id,
            userId: $user->id
        );
    }

    /**
     * Confirmation de modification de mot de passe.
     */
    public function sendPasswordChangedEmail(User $user): EmailLog
    {
        return $this->dispatchEmail(
            recipient: $user->email,
            subject: 'Votre mot de passe dls POS a été modifié',
            viewName: 'emails.auth.password-changed',
            viewData: [
                'user' => ['name' => $user->name, 'email' => $user->email],
            ],
            type: 'PASSWORD_CHANGED',
            companyId: $user->company_id,
            userId: $user->id
        );
    }

    /**
     * E-mail d'abonnement activé / renouvelé.
     */
    public function sendSubscriptionActivatedEmail(Company $company, array $subscription = [], array $payment = [], ?User $user = null): EmailLog
    {
        $recipient = $user?->email ?: $this->getCompanyAdminEmail($company);

        return $this->dispatchEmail(
            recipient: $recipient,
            subject: 'Votre abonnement dls POS est actif',
            viewName: 'emails.subscription.activated',
            viewData: [
                'user'         => ['name' => $user?->name ?: 'Administrateur', 'email' => $recipient],
                'company'      => ['name' => $company->name, 'subscription_plan' => $company->subscription_plan],
                'subscription' => $subscription,
                'payment'      => $payment,
            ],
            type: 'SUBSCRIPTION_ACTIVATED',
            companyId: $company->id,
            userId: $user?->id
        );
    }

    /**
     * E-mail de rappel d'expiration prochaine (J-7, J-3, J-1). Idempotence assurée.
     */
    public function sendSubscriptionExpiringEmail(Company $company, int $daysRemaining, string $expiresAt, ?User $user = null): ?EmailLog
    {
        $recipient = $user?->email ?: $this->getCompanyAdminEmail($company);

        // Contrôle d'idempotence : Ne pas réémettre le même rappel J-X dans les dernières 24h
        $alreadySent = EmailLog::where('company_id', $company->id)
            ->where('type', 'SUBSCRIPTION_EXPIRING')
            ->where('created_at', '>=', now()->subHours(24))
            ->whereRaw("JSON_EXTRACT(metadata, '$.daysRemaining') = ?", [$daysRemaining])
            ->exists();

        if ($alreadySent) {
            return null;
        }

        return $this->dispatchEmail(
            recipient: $recipient,
            subject: "Rappel : Votre abonnement dls POS expire dans {$daysRemaining} jour(s)",
            viewName: 'emails.subscription.expiring',
            viewData: [
                'user'          => ['name' => $user?->name ?: 'Administrateur', 'email' => $recipient],
                'company'       => ['name' => $company->name, 'subscription_plan' => $company->subscription_plan],
                'daysRemaining' => $daysRemaining,
                'expiresAt'     => $expiresAt,
            ],
            type: 'SUBSCRIPTION_EXPIRING',
            companyId: $company->id,
            userId: $user?->id
        );
    }

    /**
     * E-mail d'abonnement expiré.
     */
    public function sendSubscriptionExpiredEmail(Company $company, string $expiredAt, ?User $user = null): ?EmailLog
    {
        $recipient = $user?->email ?: $this->getCompanyAdminEmail($company);

        $alreadySent = EmailLog::where('company_id', $company->id)
            ->where('type', 'SUBSCRIPTION_EXPIRED')
            ->where('created_at', '>=', now()->subHours(48))
            ->exists();

        if ($alreadySent) {
            return null;
        }

        return $this->dispatchEmail(
            recipient: $recipient,
            subject: 'Alerte : Votre abonnement dls POS a expiré',
            viewName: 'emails.subscription.expired',
            viewData: [
                'user'      => ['name' => $user?->name ?: 'Administrateur', 'email' => $recipient],
                'company'   => ['name' => $company->name, 'subscription_plan' => $company->subscription_plan],
                'expiredAt' => $expiredAt,
            ],
            type: 'SUBSCRIPTION_EXPIRED',
            companyId: $company->id,
            userId: $user?->id
        );
    }

    /**
     * E-mail de règlement d'abonnement réussi ou échoué.
     */
    public function sendPaymentStatusEmail(Company $company, array $payment, ?User $user = null): EmailLog
    {
        $recipient = $user?->email ?: $this->getCompanyAdminEmail($company);
        $status = $payment['status'] ?? 'paid';
        $subject = $status === 'paid' ? 'Confirmation de votre règlement dls POS' : 'Échec de votre règlement dls POS';

        return $this->dispatchEmail(
            recipient: $recipient,
            subject: $subject,
            viewName: 'emails.payment.payment-status',
            viewData: [
                'user'    => ['name' => $user?->name ?: 'Administrateur', 'email' => $recipient],
                'company' => ['name' => $company->name],
                'payment' => $payment,
            ],
            type: $status === 'paid' ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED',
            companyId: $company->id,
            userId: $user?->id
        );
    }

    /**
     * E-mail de notification de maintenance.
     */
    public function sendMaintenanceNotificationEmail(string $recipient, string $title, string $messageBody, string $status = 'scheduled', ?string $startsAt = null, ?string $endsAt = null, ?int $companyId = null): EmailLog
    {
        return $this->dispatchEmail(
            recipient: $recipient,
            subject: "dls POS — Maintenance Système : {$title}",
            viewName: 'emails.maintenance.maintenance',
            viewData: [
                'title'       => $title,
                'messageBody' => $messageBody,
                'status'      => $status,
                'startsAt'    => $startsAt,
                'endsAt'      => $endsAt,
            ],
            type: 'MAINTENANCE_' . strtoupper($status),
            companyId: $companyId
        );
    }

    /**
     * E-mail d'alerte sécurité.
     */
    public function sendSecurityAlertEmail(User $user, string $alertTitle, string $alertDescription, ?string $ipAddress = null): EmailLog
    {
        return $this->dispatchEmail(
            recipient: $user->email,
            subject: "Alerte de Sécurité dls POS : {$alertTitle}",
            viewName: 'emails.security.alert',
            viewData: [
                'user'             => ['name' => $user->name, 'email' => $user->email],
                'alertTitle'       => $alertTitle,
                'alertDescription' => $alertDescription,
                'ipAddress'        => $ipAddress,
            ],
            type: 'SECURITY_ALERT',
            companyId: $user->company_id,
            userId: $user->id
        );
    }

    /**
     * E-mail de test SMTP exécuté en direct ou via queue.
     */
    public function sendTestEmail(string $recipientEmail, bool $sync = true): array
    {
        $subject = 'Test de connexion SMTP dls POS';
        $viewName = 'emails.test-email';
        $viewData = ['tested_at' => now()->toIso8601String()];

        if ($sync) {
            try {
                $mailable = new ApexPosGenericMail($subject, $viewName, $viewData);
                Mail::to($recipientEmail)->send($mailable);

                $log = EmailLog::create([
                    'recipient' => $recipientEmail,
                    'sender'    => config('mail.from.address', 'infos@dlscorporation.ci'),
                    'type'      => 'SMTP_TEST',
                    'subject'   => $subject,
                    'status'    => 'sent',
                    'attempts'  => 1,
                    'sent_at'   => now(),
                    'metadata'  => $viewData,
                ]);

                return ['success' => true, 'message' => "E-mail de test transmis avec succès à {$recipientEmail}.", 'log' => $log];
            } catch (\Throwable $e) {
                $log = EmailLog::create([
                    'recipient'     => $recipientEmail,
                    'sender'        => config('mail.from.address', 'infos@dlscorporation.ci'),
                    'type'          => 'SMTP_TEST',
                    'subject'       => $subject,
                    'status'        => 'failed',
                    'attempts'      => 1,
                    'error_message' => $e->getMessage(),
                    'metadata'      => $viewData,
                ]);

                return [
                    'success' => false,
                    'message' => "Échec de l'envoi de l'e-mail de test : " . $e->getMessage(),
                    'error'   => $e->getMessage(),
                    'log'     => $log
                ];
            }
        }

        $log = $this->dispatchEmail($recipientEmail, $subject, $viewName, $viewData, 'SMTP_TEST');
        return ['success' => true, 'message' => "Job d'envoi d'e-mail de test planifié.", 'log' => $log];
    }

    /**
     * Méthode utilitaire interne d'enregistrement du log et d'envoi (synchrone ou asynchrone).
     */
    protected function dispatchEmail(
        string $recipient,
        string $subject,
        string $viewName,
        array $viewData = [],
        string $type = 'NOTIFICATION',
        ?int $companyId = null,
        ?int $userId = null
    ): EmailLog {
        $log = EmailLog::create([
            'company_id' => $companyId,
            'user_id'    => $userId,
            'recipient'  => $recipient,
            'sender'     => config('mail.from.address', 'infos@dlscorporation.ci'),
            'type'       => $type,
            'subject'    => $subject,
            'status'     => 'queued',
            'attempts'   => 0,
            'metadata'   => $viewData,
        ]);

        // Envoi direct synchrone pour garantir la livraison immédiate sur le VPS
        try {
            $mailable = new ApexPosGenericMail($subject, $viewName, $viewData);
            Mail::to($recipient)->send($mailable);

            $log->update([
                'status'   => 'sent',
                'attempts' => 1,
                'sent_at'  => now(),
            ]);
        } catch (Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Échec envoi e-mail [{$type}] à {$recipient} : " . $e->getMessage());
            $log->update([
                'status'        => 'failed',
                'attempts'      => 1,
                'failed_at'     => now(),
                'error_message' => $e->getMessage(),
            ]);
        }

        return $log;
    }

    /**
     * Récupérer l'e-mail de l'administrateur d'une entreprise.
     */
    protected function getCompanyAdminEmail(Company $company): string
    {
        $admin = User::withoutGlobalScopes()
            ->where('company_id', $company->id)
            ->where('status', 'active')
            ->whereHas('role', fn ($q) => $q->where('slug', 'admin'))
            ->first();

        return $admin?->email ?: ($company->email ?: 'infos@dlscorporation.ci');
    }
}
