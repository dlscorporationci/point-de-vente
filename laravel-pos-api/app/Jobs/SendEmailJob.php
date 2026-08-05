<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Models\EmailLog;
use App\Mail\ApexPosGenericMail;
use Throwable;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [10, 30, 60];

    public string $recipient;
    public string $subject;
    public string $viewName;
    public array $viewData;
    public string $type;
    public ?int $companyId;
    public ?int $userId;
    public ?int $emailLogId;

    public function __construct(
        string $recipient,
        string $subject,
        string $viewName,
        array $viewData = [],
        string $type = 'NOTIFICATION',
        ?int $companyId = null,
        ?int $userId = null,
        ?int $emailLogId = null
    ) {
        $this->recipient  = $recipient;
        $this->subject    = $subject;
        $this->viewName   = $viewName;
        $this->viewData   = $viewData;
        $this->type       = $type;
        $this->companyId  = $companyId;
        $this->userId     = $userId;
        $this->emailLogId = $emailLogId;
    }

    public function handle(): void
    {
        $log = null;
        if ($this->emailLogId) {
            $log = EmailLog::find($this->emailLogId);
        }

        if (!$log) {
            $log = EmailLog::create([
                'company_id' => $this->companyId,
                'user_id'    => $this->userId,
                'recipient'  => $this->recipient,
                'sender'     => config('mail.from.address', 'infos@dlscorporation.ci'),
                'type'       => $this->type,
                'subject'    => $this->subject,
                'status'     => 'sending',
                'attempts'   => 1,
                'metadata'   => $this->viewData,
            ]);
            $this->emailLogId = $log->id;
        } else {
            $log->update([
                'status'   => 'sending',
                'attempts' => $log->attempts + 1,
            ]);
        }

        try {
            $mailable = new ApexPosGenericMail($this->subject, $this->viewName, $this->viewData);
            Mail::to($this->recipient)->send($mailable);

            $log->update([
                'status'   => 'sent',
                'sent_at'  => now(),
                'error_message' => null,
            ]);
        } catch (Throwable $e) {
            $log->update([
                'status'        => 'failed',
                'failed_at'     => now(),
                'error_message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function failed(Throwable $exception): void
    {
        if ($this->emailLogId) {
            $log = EmailLog::find($this->emailLogId);
            if ($log) {
                $log->update([
                    'status'        => 'failed',
                    'failed_at'     => now(),
                    'error_message' => 'Échec définitif après ' . $this->tries . ' tentatives: ' . $exception->getMessage(),
                ]);
            }
        }
    }
}
