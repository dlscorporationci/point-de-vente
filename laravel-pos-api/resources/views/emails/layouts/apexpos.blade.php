<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'ApexPOS — Notification Système' }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f1f5f9;
            padding: 30px 0;
        }
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-radius: 12px;
            border-spacing: 0;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 28px 30px;
            text-align: center;
        }
        .header img {
            max-height: 48px;
            width: auto;
        }
        .header-title {
            color: #ffffff;
            font-size: 22px;
            font-weight: 800;
            margin: 8px 0 0 0;
            letter-spacing: 0.5px;
        }
        .header-subtitle {
            color: #38bdf8;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-top: 4px;
            font-weight: 600;
        }
        .content {
            padding: 36px 32px;
            background-color: #ffffff;
        }
        .content h1, .content h2 {
            color: #0f172a;
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 16px;
        }
        .content p {
            font-size: 15px;
            line-height: 1.6;
            color: #334155;
            margin-top: 0;
            margin-bottom: 18px;
        }
        .info-card {
            background-color: #f8fafc;
            border-left: 4px solid #0284c7;
            border-radius: 6px;
            padding: 16px 20px;
            margin: 24px 0;
        }
        .info-card table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-card td {
            padding: 6px 0;
            font-size: 14px;
        }
        .info-card td.label {
            color: #64748b;
            font-weight: 600;
            width: 40%;
        }
        .info-card td.value {
            color: #0f172a;
            font-weight: 700;
            text-align: right;
        }
        .btn-container {
            text-align: center;
            margin: 30px 0 20px 0;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            font-size: 15px;
            font-weight: 700;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .badge-success { background-color: #dcfce7; color: #166534; }
        .badge-warning { background-color: #fef3c7; color: #92400e; }
        .badge-danger  { background-color: #fee2e2; color: #991b1b; }
        .badge-info    { background-color: #e0f2fe; color: #075985; }

        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 24px 30px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
        }
        .footer a {
            color: #0284c7;
            text-decoration: none;
        }
        .footer-divider {
            height: 1px;
            background-color: #cbd5e1;
            margin: 16px 0;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main" align="center">
            <!-- HEADER -->
            <tr>
                <td class="header">
                    <div class="header-title">ApexPOS</div>
                    <div class="header-subtitle">GESTION COMMERCIALE & ENCAISSEMENT SAAS</div>
                </td>
            </tr>

            <!-- MAIN CONTENT -->
            <tr>
                <td class="content">
                    @yield('content')
                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td class="footer">
                    <p style="margin: 0 0 8px 0; font-weight: 600;">Besoin d'assistance ? Contactez le support technique :</p>
                    <p style="margin: 0 0 12px 0;">
                        📧 E-mail : <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a> • 🌐 Web : <a href="https://dlscorporation.ci">dlscorporation.ci</a>
                    </p>
                    <div class="footer-divider"></div>
                    <p style="margin: 0; color: #94a3b8;">
                        © {{ date('Y') }} ApexPOS — Tous droits réservés. Une solution éditée par DLS Corporation.
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
