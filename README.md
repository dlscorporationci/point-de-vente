# 🛒 ApexPOS - Système de Gestion & Point de Vente (POS / ERP Multi-Boutiques)

Solution complète et professionnelle de Gestion Commerciale, d'Approvisionnements, de Stocks et de Caisse Tactique Multi-Entreprises & Multi-Points de Vente.

---

## 🚀 Fonctionnalités Principales

- **Architecture Multi-Entreprises & Multi-Boutiques** : Isolation stricte des données par entreprise et basculement dynamique par point de vente.
- **Point de Vente Tactile (POS)** : Caisses enregistreuses avec gestion des sessions (ouverture/clôture), paiements en espèces, cartes, mobile money (GeniusPay/Wave/MTN/Orange).
- **Scanner de Code-Barres Intégré** : Support des douchettes USB/Bluetooth et détection vidéo par caméra (EAN-13, Code 128, UPC).
- **Gestion des Approvisionnements & Achats** : Suivi des bons de commande, livraisons en stock et gestion des dettes fournisseurs.
- **Transferts Inter-Boutiques** : Cycle de vie complet à 7 étapes (`draft`, `approved`, `shipped`, `received`, `rejected`, `cancelled`).
- **Gestion des Stocks** : Mouvements, ajustements, seuils d'alertes critiques et valorisation du stock sur PAMP (Prix Achat Moyen Pondéré).
- **Tableaux de Bord & Rapports Financiers** : Marges brutes, TVA (18%), balance âgée fournisseurs et exportations PDF d'impression.
- **Sécurité & Transactions Critiques** : Transactions DB atomiques, verrous de concurrence pessimistes (`lockForUpdate`), journalisation d'audit et droits d'accès granulaires par rôle.

---

## 🛠️ Stack Technique

### Backend (API REST)
- **Framework** : Laravel 12 / PHP 8.4
- **Base de Données** : MySQL / MariaDB (Transactions InnoDB)
- **Authentification** : Laravel Sanctum + PIN Caisse
- **Documentation API** : OpenAPI 3.0 (`Documentation_API_ApexPOS.md`)

### Frontend (Application Web POS)
- **Framework** : React 19 / Vite
- **Gestion d'État** : Context API & Zustand
- **Styles** : CSS Vanilla Modern & Glassmorphism Responsive
- **Impression** : Impression Thermique Reçus 80mm & Reports A4 PDF

---

## ⚙️ Installation & Démarrage

### 1. Backend API (Laravel)
```bash
cd laravel-pos-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 2. Frontend React (Application Web)
```bash
cd react-pos-app
npm install
npm run dev
```

---

## 📄 Licence
Développé et géré par **DLS Corporation CI**. Tous droits réservés.
