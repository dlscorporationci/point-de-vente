<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Vérification de votre adresse e-mail</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
        <h2 style="color: #38bdf8; margin-top: 0;">ApexPOS Enterprise</h2>
        <h3 style="color: #ffffff;">Vérification de votre adresse e-mail</h3>
        <p style="color: #cbd5e1;">Bonjour {{ $user['name'] }},</p>
        <p style="color: #cbd5e1;">Merci de vous être inscrit sur ApexPOS Enterprise. Pour activer votre compte et accéder à l'ensemble des fonctionnalités de votre point de vente, veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous :</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $verificationUrl }}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Activer mon compte ApexPOS</a>
        </div>

        <p style="color: #94a3b8; font-size: 13px;">Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :<br>
        <a href="{{ $verificationUrl }}" style="color: #38bdf8; word-break: break-all;">{{ $verificationUrl }}</a></p>
        
        <hr style="border: 0; border-top: 1px solid #334155; margin: 30px 0;">
        <p style="color: #64748b; font-size: 12px; text-align: center;">Ce lien de vérification expirera dans 60 minutes. Si vous n'avez pas créé de compte ApexPOS, vous pouvez ignorer cet e-mail.</p>
    </div>
</body>
</html>
