# APEXPOS ENTERPRISE — GOOGLE OAUTH 2.0 / OPENID CONNECT DOCUMENTATION

## 1. Vue d'ensemble

ApexPOS Enterprise intègre l'authentification **Google OAuth 2.0 / OpenID Connect** comme méthode d'identification complémentaire.
Cette méthode permet aux utilisateurs ApexPOS autorisés d'accéder à l'application via leur compte Google tout en préservant **strictement** le modèle de sécurité ApexPOS :

- Sanctum Tokens pour la gestion de session API
- Multi-Tenant (`company_id`) & Isolation de boutique (`branch_id`)
- Matrice des rôles & permissions RBAC
- Interdiction stricte de l'auto-provisioning d'entreprises ou de rôles

---

## 2. Configuration dans Google Cloud Console

1. Rendez-vous sur la [Google Cloud Console](https://console.cloud.google.com/).
2. Créez un nouveau projet ou sélectionnez un projet existant.
3. Allez dans **APIs & Services** > **OAuth consent screen** :
   - Type d'application : **External** (ou Internal pour une organisation Google Workspace)
   - Ajoutez les scopes obligatoires : `openid`, `email`, `profile`
4. Allez dans **APIs & Services** > **Credentials** :
   - Cliquez sur **Create Credentials** > **OAuth client ID**
   - Application Type : **Web application**
   - Authorized JavaScript origins :
     - Local : `http://localhost:5173`, `http://127.0.0.1:8000`
     - Staging : `https://staging.apexpos.ci`
     - Production : `https://app.apexpos.ci`
   - Authorized redirect URIs :
     - Local : `http://127.0.0.1:8000/api/v1/auth/google/callback`
     - Staging : `https://staging.apexpos.ci/api/v1/auth/google/callback`
     - Production : `https://app.apexpos.ci/api/v1/auth/google/callback`

---

## 3. Configuration des Variables d'Environnement (`.env`)

Dans le fichier `.env` du backend Laravel (le fichier `.env` ne doit JAMAIS être commité sous Git) :

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/api/v1/auth/google/callback
```

---

## 4. Architecture de Sécurité & Flux OAuth

```text
React Frontend
      │
      │ 1. GET /api/v1/auth/google/redirect?json=true
      ▼
Laravel API Backend
      │  - Génération state anti-CSRF (Cache::put 300s)
      │  - Construction de l'URL Google OAuth
      ▼
Google OAuth Authorization (https://accounts.google.com/o/oauth2/v2/auth)
      │  - Utilisateur autorise l'accès
      ▼
Callback Redirect (GET/POST /api/v1/auth/google/callback?code=...&state=...)
      │
      ├── Validation state anti-CSRF
      ├── Échange du code OAuth contre les jetons (https://oauth2.googleapis.com/token)
      ├── Validation cryptographique (Issuer, Audience, Email Verified)
      ├── Extraction du Google Subject ID (`sub`)
      │
      ├── Recherche Utilisateur ApexPOS :
      │     1. Recherche par `google_id` == `sub`
      │     2. Recherche par `email` == `google_email` (Compte existant)
      │
      ├── Contrôles de Sécurité :
      │     - Utilisateur inactif/suspendu -> REJET (403 USER_SUSPENDED)
      │     - Utilisateur inconnu -> REJET (403 GOOGLE_ACCOUNT_NOT_PROVISIONED)
      │
      ├── Liaison du compte Google (google_id, google_email, google_avatar)
      ├── Résolution Tenant (`company_id`) & Rôle/Permissions RBAC
      ├── Génération du Token Sanctum ApexPOS (`createToken('pos-google-token')`)
      └── Audit Log (`google_login_success`)
```

---

## 5. Règles de Sécurité Inviolables

1. **Aucun Auto-Provisioning** : Un utilisateur Google non invité ou non pré-enregistré ne peut pas créer d'entreprise ou s'attribuer un rôle.
2. **Champ d'Autorité Tenant/RBAC** : Les rôles et permissions sont déterminés exclusivement par le serveur ApexPOS, jamais par Google.
3. **Sub Identifier comme Clé Primaire Google** : L'association permanente se fait sur le `sub` (Google Subject ID), insensible aux changements d'adresse e-mail.
4. **Masquage des Secrets** : Le `GOOGLE_CLIENT_SECRET` ne quitte jamais le serveur Laravel.
