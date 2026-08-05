@extends('emails.layouts.apexpos')

@section('content')
<h1>Test de Connexion SMTP ApexPOS 🧪</h1>

<p>Bonjour,</p>

<p>Ceci est un e-mail de test envoyé depuis la console d'administration SaaS d'ApexPOS Enterprise.</p>

<div class="info-card" style="border-left-color: #22c55e;">
    <table>
        <tr>
            <td class="label">Serveur SMTP :</td>
            <td class="value"><code>webmail.oxa.host:465 (SSL/TLS)</code></td>
        </tr>
        <tr>
            <td class="label">Expéditeur :</td>
            <td class="value"><code>infos@dlscorporation.ci</code></td>
        </tr>
        <tr>
            <td class="label">Statut :</td>
            <td class="value"><span class="badge badge-success">SUCCÈS CONNECTIVITÉ</span></td>
        </tr>
        <tr>
            <td class="label">Date du Test :</td>
            <td class="value">{{ now()->format('d/m/Y H:i:s') }}</td>
        </tr>
    </table>
</div>

<p>Si vous recevez ce message, votre configuration SMTP transactionnelle est 100% opérationnelle !</p>
@endsection
