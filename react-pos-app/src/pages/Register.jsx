import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { PasswordInput } from '../components/PasswordInput';
import logo from '../assets/logo.jpg';

export const Register = ({ setActiveTab }) => {
  const { login } = useApp();

  // État du formulaire d'inscription
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // États génériques
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/v1/auth/register', {
        company_name: companyName,
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess('Votre compte entreprise a été créé avec succès ! Redirection vers la page de connexion...');
      setTimeout(() => {
        setActiveTab('auth');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Une erreur est survenue lors de l\'inscription.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="register-card card">
        <img src={logo} alt="ApexPOS Logo" className="register-logo" />
        <h2>Créer un compte ApexPOS</h2>
        <p className="register-subtitle">Enregistrez votre entreprise et configurez votre point de vente en quelques secondes.</p>

        {error && <div className="error-banner">⚠️ {error}</div>}
        {success && <div className="success-banner">✔️ {success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">Nom de l'Entreprise *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ex: Quincaillerie Centrale" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nom du Gestionnaire Principal *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ex: Amadou Fall" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Adresse E-mail *</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Ex: contact@entreprise.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe *</label>
            <PasswordInput 
              placeholder="Minimum 6 caractères" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe *</label>
            <PasswordInput 
              placeholder="Ressaisir le mot de passe" 
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
            {loading ? 'Création de l\'entreprise en cours...' : 'Créer mon compte entreprise'}
          </button>
        </form>

        <div className="register-footer">
          <div>
            Déjà un compte ?{' '}
            <button onClick={() => setActiveTab('auth')} className="btn-link">
              Se connecter
            </button>
          </div>
          <div style={{ marginTop: '14px' }}>
            <button
              onClick={() => setActiveTab('home')}
              className="btn-link"
              style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}
            >
              <i className="fa-solid fa-arrow-left me-1"></i> Retour à l'accueil
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .register-container {
          position: relative;
          width: 100%;
          height: calc(100vh - 74px);
          min-height: calc(100vh - 74px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          box-sizing: border-box;
          overflow: hidden;
          z-index: 1;
        }

        .register-card {
          width: 100%;
          max-width: 460px;
          max-height: calc(100vh - 90px);
          padding: 28px 24px;
          text-align: center;
          margin: 0;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          overflow-y: auto;
          box-sizing: border-box;
          scrollbar-width: thin;
          scrollbar-color: var(--color-primary, #2563eb) var(--bg-input, rgba(0, 0, 0, 0.05));
        }

        .register-logo {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-primary);
          margin-bottom: 16px;
        }

        .register-card h2 {
          font-family: var(--font-title);
          font-weight: 800;
          font-size: 22px;
          margin: 0 0 8px 0;
          color: var(--text-main);
        }

        .register-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .register-form {
          text-align: left;
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          font-family: var(--font-title);
          font-weight: 700;
          margin-top: 16px;
        }

        .register-footer {
          margin-top: 20px;
          font-size: 13px;
          color: var(--text-muted);
        }

        .btn-link {
          background: transparent;
          border: none;
          color: var(--color-primary);
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .btn-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
