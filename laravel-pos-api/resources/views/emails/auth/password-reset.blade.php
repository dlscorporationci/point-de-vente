@extends('emails.layouts.apexpos')

@section('content')
<h1>Réinitialisation de votre mot de passe 🔒</h1>

<p>Bonjour <strong>{{ $user['name'] }}</strong>,</p>

<p>Vous avez demandé la réinitialisation du mot de passe de votre compte dls POS associé à l'adresse <strong>{{ $user['email'] }}</strong>.</p>

<p>Veuillez cliquer sur le bouton ci-dessous pour choisir votre nouveau mot de passe :</p>

<div style="text-align: center; margin: 30px 0;">
    <a href="{{ $resetUrl }}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; font-size: 15px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
        🔑 Réinitialiser mon mot de passe
    </a>
</div>

<p style="font-size: 13px; color: #64748b;">Si le bouton ne fonctionne pas, vous pouvez copier-coller le lien suivant dans votre navigateur :<br>
<a href="{{ $resetUrl }}" style="color: #2563eb; word-break: break-all;">{{ $resetUrl }}</a></p>

<div class="info-card" style="border-left-color: #eab308; margin-top: 25px;">
    <p style="margin: 0; font-size: 13px; color: #854d0e;">
        ⚠️ <strong>Important :</strong> Ce lien sécurisé à usage unique expirera automatiquement dans <strong>60 minutes</strong>. Si vous n'êtes pas à l'origine de cette demande, aucune action n'est requise et votre mot de passe restera inchangé.
    </p>
</div>
@endsection
