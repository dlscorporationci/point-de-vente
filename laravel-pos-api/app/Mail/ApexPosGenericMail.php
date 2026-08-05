<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;

class ApexPosGenericMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $emailSubject;
    public string $viewName;
    public array $mailPayload;

    public function __construct(string $subject, string $viewName, array $viewData = [])
    {
        $this->emailSubject = $subject;
        $this->viewName     = $viewName;
        $this->mailPayload  = $viewData;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('infos@dlscorporation.ci', 'ApexPOS Enterprise'),
            subject: $this->emailSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: $this->viewName,
            with: array_merge(['subject' => $this->emailSubject], $this->mailPayload),
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
