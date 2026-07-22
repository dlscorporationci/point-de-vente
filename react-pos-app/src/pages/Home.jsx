import React from 'react';
import logo from '../assets/logo.jpg';

export const Home = ({ setActiveTab }) => {
  return (
    <div className="home-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="home-hero card">
        <img src={logo} alt="ApexPOS Logo" className="home-logo" />
        <h1 className="home-title">Bienvenue sur ApexPOS</h1>
        <p className="home-subtitle">
          La solution professionnelle de gestion commerciale de Point de Vente (POS) multi-boutiques et multi-entreprises.
        </p>

        <div className="home-actions">
          <button onClick={() => setActiveTab('auth')} className="btn btn-primary btn-large">
            <i className="fa-solid fa-key me-2"></i> Se Connecter
          </button>
          <button onClick={() => setActiveTab('register')} className="btn btn-secondary btn-large">
            <i className="fa-solid fa-pen-to-square me-2"></i> Créer un Compte
          </button>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card card">
          <span className="feature-icon"><i className="fa-solid fa-cash-register text-primary"></i></span>
          <h3>Terminal Caisse Tactile</h3>
          <p>Enregistrez vos ventes rapidement avec un panier local fluide, gestion des codes-barres et calcul de monnaie.</p>
        </div>

        <div className="feature-card card">
          <span className="feature-icon"><i className="fa-solid fa-layer-group text-success"></i></span>
          <h3>Suivi des Stocks & PAMP</h3>
          <p>Mise à jour en temps réel lors des achats et ventes. Recalcul automatique du Prix d'Achat Moyen Pondéré (PAMP).</p>
        </div>

        <div className="feature-card card">
          <span className="feature-icon"><i className="fa-solid fa-right-left text-warning"></i></span>
          <h3>Logistique Inter-Boutiques</h3>
          <p>Initiez et validez des transferts de marchandises sécurisés entre vos différentes succursales en un clic.</p>
        </div>

        <div className="feature-card card">
          <span className="feature-icon"><i className="fa-solid fa-shield-halved text-info"></i></span>
          <h3>Audit & Rapport Financier</h3>
          <p>Consignez chaque écriture sensible et analysez vos performances financières avec export PDF professionnel.</p>
        </div>
      </div>

      <style>{`
        .home-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          z-index: 1;
          margin-top: 80px;
        }

        .home-hero {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 800px;
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .home-logo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--color-primary);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .home-title {
          font-family: var(--font-title);
          font-weight: 800;
          font-size: 32px;
          color: var(--text-main);
          margin: 0;
        }

        .home-subtitle {
          font-size: 16px;
          color: var(--text-muted);
          max-width: 600px;
          line-height: 1.6;
        }

        .home-actions {
          display: flex;
          gap: 16px;
          margin-top: 10px;
        }

        .btn-large {
          padding: 12px 30px;
          font-size: 15px;
          font-weight: 800;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1000px;
        }

        .feature-card {
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary);
        }

        .feature-icon {
          font-size: 40px;
        }

        .feature-card h3 {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 18px;
          color: var(--text-main);
          margin: 0;
        }

        .feature-card p {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
