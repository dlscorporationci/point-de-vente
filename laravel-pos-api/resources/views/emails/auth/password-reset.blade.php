@extends('emails.layouts.apexpos')

@section('content')
<h1>Réinitialisation de votre mot de passe 🔒</h1>

<p>Bonjour <strong>{{ $user['name'] }}</strong>,</p>

<p>Une demande de réinitialisation de mot de passe a été émise pour votre compte ApexPOS associé à l'adresse <strong>{{ $user['email'] }}</strong>.</p>

<p>Voici votre code secret de sécurité à 6 chiffres pour réinitialiser votre mot de passe sur l'application :</p>

<div style="background-color: #f1f5f9; padding: 22px; text-align: center; border-radius: 8px; margin: 25px 0; border: 1px solid #cbd5e1;">
    <span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; font-family: monospace;">
        {{ $code }}
    </span>
</div>

<div class="info-card" style="border-left-color: #eab308;">
    <p style="margin: 0; font-size: 13px; color: #854d0e;">
        ⚠️ <strong>Important :</strong> Ce code sécurisé expirera automatiquement dans <strong>15 minutes</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.
    </p>
</div>
@endsection
