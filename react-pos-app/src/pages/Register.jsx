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
  const [registeredData, setRegisteredData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      const data = response.data;
      const userObj = data.user;
      const token = data.token;

      // Authentifier directement l'utilisateur créé dans l'application
      if (userObj && token) {
        login(userObj, token);
      }

      // Stocker les données pour la Fiche d'Accès officielle
      setRegisteredData({
        companyName: userObj.company?.name || companyName,
        companyCode: data.company_code || userObj.company?.code || 'ATTRIBUE',
        adminName: name,
        email: email,
        pinCode: data.pin_code || '1234',
        userObj,
        token
      });

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

  const handleCopyCredentials = () => {
    if (!registeredData) return;
    const summaryText = `🔑 FICHE D'ACCÈS DLS POS\n---------------------------\n• Entreprise : ${registeredData.companyName}\n• Code Entreprise : ${registeredData.companyCode}\n• Administrateur : ${registeredData.adminName}\n• Email de connexion : ${registeredData.email}\n• Code PIN Caisse : ${registeredData.pinCode}\n---------------------------\nAccès : http://${window.location.host}`;
    
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleGoToWorkspace = () => {
    if (setActiveTab) {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="register-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="register-card card">
        <img src={logo} alt="DLS POS Logo" className="register-logo" />

        {registeredData ? (
          /* ── ÉCRAN DE FICHE D'ACCÈS OFFICIELLE (CRÉATION RÉUSSIE) ── */
          <div className="access-summary-container">
            <div className="success-badge-header mb-3">
              <i className="fa-solid fa-circle-check text-success me-2" style={{ fontSize: '24px' }}></i>
              <h2 className="d-inline-block m-0" style={{ fontSize: '20px', fontWeight: 800 }}>
                Entreprise Créée avec Succès !
              </h2>
            </div>

            <p className="text-muted" style={{ fontSize: '13px', marginBottom: '20px' }}>
              Voici votre <strong>Fiche d'Accès Officielle</strong>. Conservez précieusement ces identifiants pour vous connecter depuis n'importe quel poste ou mobile.
            </p>

            <div className="credentials-card mb-3 text-left">
              <div className="cred-row highlight-code">
                <span className="cred-label">🔑 Code Entreprise (Requis pour POS)</span>
                <div className="cred-code-box">
                  <strong>{registeredData.companyCode}</strong>
                </div>
              </div>

              <div className="cred-row">
                <span className="cred-label">🏢 Nom de l'Entreprise</span>
                <span className="cred-val">{registeredData.companyName}</span>
              </div>

              <div className="cred-row">
                <span className="cred-label">👤 Administrateur Principal</span>
                <span className="cred-val">{registeredData.adminName}</span>
              </div>

              <div className="cred-row">
                <span className="cred-label">📧 E-mail de Connexion</span>
                <span className="cred-val">{registeredData.email}</span>
              </div>

              <div className="cred-row">
                <span className="cred-label">🔢 PIN Caisse par Défaut</span>
                <span className="cred-val badge bg-primary" style={{ fontSize: '13px', padding: '4px 10px' }}>
                  {registeredData.pinCode}
                </span>
              </div>
            </div>

            <div className="d-flex gap-2 mb-3">
              <button 
                type="button" 
                onClick={handleCopyCredentials} 
                className="btn btn-outline-primary flex-1"
                style={{ fontWeight: 700, fontSize: '13px' }}
              >
                <i className="fa-solid fa-copy me-1"></i>
                {copied ? 'Copié !' : 'Copier mes Accès'}
              </button>
              
              <button 
                type="button" 
                onClick={() => window.print()} 
                className="btn btn-outline-secondary flex-1"
                style={{ fontWeight: 700, fontSize: '13px' }}
              >
                <i className="fa-solid fa-print me-1"></i> Imprimer
              </button>
            </div>

            <button 
              type="button" 
              onClick={handleGoToWorkspace} 
              className="btn btn-primary w-100 py-3"
              style={{ fontWeight: 800, fontSize: '15px', borderRadius: '10px' }}
            >
              <i className="fa-solid fa-rocket me-2"></i>
              Accéder à mon Espace de Travail
            </button>
          </div>
        ) : (
          /* ── FORMULAIRE D'INSCRIPTION STANDARD ── */
          <>
            <h2>Créer un compte DLS POS</h2>
            <p className="register-subtitle">Enregistrez votre entreprise et configurez votre point de vente en quelques secondes.</p>

            {error && <div className="error-banner mb-3"><i className="fa-solid fa-triangle-exclamation me-1"></i> {error}</div>}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group mb-3">
                <label className="form-label" style={{ fontWeight: 700 }}>Nom de l'Entreprise *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Quincaillerie Centrale" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label" style={{ fontWeight: 700 }}>Nom du Gestionnaire Principal *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Amadou Fall" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label" style={{ fontWeight: 700 }}>Adresse E-mail *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Ex: contact@entreprise.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label" style={{ fontWeight: 700 }}>Mot de passe *</label>
                <PasswordInput 
                  placeholder="Minimum 6 caractères" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label" style={{ fontWeight: 700 }}>Confirmer le mot de passe *</label>
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

            <div className="register-footer mt-3">
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
          </>
        )}
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
          max-width: 480px;
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
          width: 64px;
          height: 64px;
          border-radius: 16px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

        .credentials-card {
          background: var(--bg-input, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          padding: 16px;
        }

        .cred-row {
          margin-bottom: 12px;
        }

        .cred-row:last-child {
          margin-bottom: 0;
        }

        .cred-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .cred-val {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
        }

        .highlight-code {
          background: rgba(37, 99, 235, 0.06);
          padding: 10px;
          border-radius: 8px;
          border: 1px dashed var(--color-primary);
        }

        .cred-code-box {
          font-size: 20px;
          font-family: monospace;
          letter-spacing: 3px;
          color: var(--color-primary);
          font-weight: 800;
          margin-top: 2px;
        }

        .flex-1 {
          flex: 1;
        }
      `}</style>
    </div>
  );
};
