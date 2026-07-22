import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo.jpg';

export const Login = ({ setActiveTab }) => {
  const { user, login, logout } = useApp();

  // Mode de connexion : 'standard' par défaut (pour les nouveaux inscrits et admin), 'pin' (caisse)
  const [loginMode, setLoginMode] = useState('standard');

  // Connexion par Code PIN Caisse
  const [companyCode, setCompanyCode] = useState('');
  const [pinCode, setPinCode]           = useState('');

  // Connexion Standard
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // États pour mot de passe oublié
  const [forgotEmail, setForgotEmail]           = useState('');
  const [resetCode, setResetCode]               = useState('');
  const [newPassword, setNewPassword]           = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // États de chargement & erreurs
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Réinitialiser les messages d'erreurs/succès lors du changement de mode
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    setPinCode('');
  }, [loginMode]);

  // Formatage automatique du Code Entreprise en majuscules sans espaces
  const handleCompanyCodeChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setCompanyCode(val);
  };

  // Soumission login PIN Caisse (Code Entreprise + PIN)
  const handlePinSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!companyCode.trim()) {
      setError("Veuillez saisir votre code entreprise.");
      return;
    }
    if (!pinCode.trim()) {
      setError("Veuillez saisir votre code PIN.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/v1/auth/login-pin', {
        company_code: companyCode.trim(),
        pin_code: pinCode.trim()
      });
      login(response.data.user, response.data.token);
      setSuccessMsg('Connexion réussie !');
    } catch (err) {
      setError(err.response?.data?.error || 'Identifiants d\'accès incorrects.');
      setPinCode(''); // Réinitialiser le PIN en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Soumission login Standard (Admin / Password)
  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/v1/auth/login', { email, password });
      login(response.data.user, response.data.token);
      setSuccessMsg('Connexion réussie !');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Identifiants d\'accès incorrects.');
    } finally {
      setLoading(false);
    }
  };

  // Soumission demande oubli mot de passe
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await axios.post('/v1/auth/forgot-password', { email: forgotEmail });
      setSuccessMsg(res.data.message);
      if (res.data.code) {
        setResetCode(res.data.code);
      }
      setTimeout(() => setLoginMode('reset'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la demande.");
    } finally {
      setLoading(false);
    }
  };

  // Soumission réinitialisation mot de passe
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (newPassword !== newPasswordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/v1/auth/reset-password', {
        email: forgotEmail,
        token: resetCode,
        password: newPassword,
        password_confirmation: newPasswordConfirm
      });
      setSuccessMsg(res.data.message);
      setTimeout(() => {
        setLoginMode('standard');
        setEmail(forgotEmail);
        setForgotEmail('');
        setResetCode('');
        setNewPassword('');
        setNewPasswordConfirm('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Code incorrect ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (num) => {
    if (pinCode.length < 8) {
      setPinCode(pinCode + num);
    }
  };

  const handleClear = () => setPinCode('');
  const handleBackspace = () => setPinCode(pinCode.slice(0, -1));

  const handleLogout = async () => {
    try {
      await axios.post('/v1/auth/logout');
    } catch (e) {
      /* ignoré */
    } finally {
      logout();
      setPinCode('');
      setSuccessMsg(null);
    }
  };

  // Modification autonome du PIN utilisateur
  const [newSelfPin, setNewSelfPin] = useState('');
  const [pinUpdating, setPinUpdating] = useState(false);
  const [pinUpdateSuccess, setPinUpdateSuccess] = useState(null);
  const [pinUpdateError, setPinUpdateError] = useState(null);

  const handleUpdateSelfPin = async (e) => {
    e.preventDefault();
    if (!newSelfPin || newSelfPin.length < 4) {
      setPinUpdateError("Le code PIN doit comporter au moins 4 chiffres.");
      return;
    }
    setPinUpdating(true);
    setPinUpdateError(null);
    setPinUpdateSuccess(null);
    try {
      await axios.post('/v1/auth/profile', {
        name: user.name,
        email: user.email,
        pin_code: newSelfPin
      });
      setPinUpdateSuccess("✅ Votre code PIN a été modifié avec succès !");
      setNewSelfPin('');
    } catch (err) {
      setPinUpdateError(err.response?.data?.error || err.response?.data?.message || "Erreur de modification du PIN.");
    } finally {
      setPinUpdating(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="login-box card">
        <div className="brand-header">
          <img src={logo} alt="Logo" className="login-logo-img" />
          <div className="brand-logo" style={{ marginTop: '12px' }}>
            <span className="logo-text-apex">Apex</span>
            <span className="logo-text-pos">POS</span>
          </div>
          <p className="brand-subtitle">Système Professionnel de Gestion POS Multi-Entreprises</p>
        </div>

        {/* Si l'utilisateur est déjà connecté */}
        {user ? (
          <div className="profile-dashboard">
            <div className="success-banner">
              <i className="fa-solid fa-circle-check me-1"></i> {successMsg || 'Session Active'}
            </div>
            
            <div className="user-details-card">
              <div className="avatar-large">{user.name.charAt(0)}</div>
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">{user.email}</p>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Entreprise</span>
                  <span className="info-val">{user.company?.name || 'Globale'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Code Entreprise</span>
                  <span className="badge badge-tenant">{user.company?.code || '—'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Rôle</span>
                  <span className="badge badge-role">{user.role?.name || user.role}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Boutique</span>
                  <span className="info-val">{user.branch?.name || 'Toutes'}</span>
                </div>
              </div>
            </div>

            {/* Formulaire de modification autonome de son propre Code PIN */}
            <form onSubmit={handleUpdateSelfPin} className="mt-3 text-left p-3 rounded" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
              <strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>
                <i className="fa-solid fa-key me-1 text-primary"></i> Modifier mon Code PIN Personnel
              </strong>
              {pinUpdateSuccess && <div className="success-banner mb-2" style={{ fontSize: '12px' }}>{pinUpdateSuccess}</div>}
              {pinUpdateError && <div className="error-banner mb-2" style={{ fontSize: '12px' }}>{pinUpdateError}</div>}
              <div className="d-flex gap-2">
                <input 
                  type="password" 
                  className="form-control text-center" 
                  placeholder="Nouveau PIN (4 chiffres)"
                  value={newSelfPin}
                  onChange={(e) => setNewSelfPin(e.target.value.replace(/\D/g, ''))}
                  maxLength="6"
                  required
                  style={{ letterSpacing: '3px', fontWeight: 800, fontSize: '15px' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={pinUpdating} style={{ whiteSpace: 'nowrap' }}>
                  {pinUpdating ? '...' : 'Enregistrer'}
                </button>
              </div>
              <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                Ce code sera requis lors de votre prochaine connexion PIN.
              </small>
            </form>

            <button onClick={handleLogout} className="btn btn-logout mt-4">
              <i className="fa-solid fa-right-from-bracket me-1"></i> Se Déconnecter de la Session
            </button>
          </div>
        ) : (
          /* Formulaires de connexion */
          <div>
            {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
            {successMsg && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {successMsg}</div>}

            {/* A. Mode Standard (Email + Mot de Passe) - Mode par défaut pour tous */}
            {loginMode === 'standard' && (
              <form onSubmit={handleStandardSubmit} className="standard-form text-left">
                <div className="form-group mb-3">
                  <label className="form-label" style={{ fontWeight: 700 }}>Adresse E-mail *</label>
                  <input 
                    type="email" 
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@entreprise.com"
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label" style={{ fontWeight: 700 }}>Mot de passe *</label>
                  <input 
                    type="password" 
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                  {loading ? 'Connexion en cours...' : 'Se Connecter'}
                </button>
                
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button type="button" onClick={() => setLoginMode('pin')} className="btn-link-login" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-calculator me-1"></i> Connexion Caisse (PIN)
                  </button>
                  <button type="button" onClick={() => setLoginMode('forgot')} className="btn-link-login" style={{ fontSize: '12px', color: 'var(--color-primary)' }}>
                    Mot de passe oublié ?
                  </button>
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Pas encore de compte ?{' '}
                  <button type="button" onClick={() => setActiveTab('register')} className="btn-link-login">
                    Créer un compte entreprise
                  </button>
                </div>
              </form>
            )}

            {/* B. Mode PIN Caisse (Code Entreprise + PIN Utilisateur) */}
            {loginMode === 'pin' && (
              <form onSubmit={handlePinSubmit} className="pin-form-container text-left">
                
                {/* Champ 1 : Code de l'Entreprise */}
                <div className="form-group mb-3">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    <i className="fa-solid fa-building me-1 text-primary"></i> Code de l'entreprise *
                  </label>
                  <input 
                    type="text" 
                    className="form-control code-input"
                    placeholder="Ex: X8M4-K92P"
                    value={companyCode}
                    onChange={handleCompanyCodeChange}
                    maxLength="12"
                    required
                    style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, fontSize: '16px' }}
                  />
                  <small className="text-muted" style={{ fontSize: '11px' }}>
                    Code unique fourni dans votre profil d'administrateur d'entreprise.
                  </small>
                </div>

                {/* Champ 2 : Code PIN Utilisateur */}
                <div className="form-group mb-3">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    <i className="fa-solid fa-key me-1 text-primary"></i> PIN Personnel *
                  </label>
                  
                  {/* Affichage des ronds / masque du PIN */}
                  <div className="pin-dots-display mb-2">
                    {[0, 1, 2, 3].map((index) => (
                      <span 
                        key={index} 
                        className={`pin-dot ${pinCode.length > index ? 'filled' : ''}`}
                      />
                    ))}
                  </div>

                  <input 
                    type="password" 
                    className="form-control text-center"
                    placeholder="Entrez votre code PIN secret"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    maxLength="8"
                    required
                    style={{ fontSize: '18px', letterSpacing: '4px' }}
                  />
                </div>

                {/* Pavé Numérique Tactile POS */}
                <div className="pin-keypad-grid mb-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button 
                      key={num} 
                      type="button"
                      className="keypad-btn"
                      onClick={() => handleKeyPress(num)}
                      disabled={loading}
                    >
                      {num}
                    </button>
                  ))}
                  <button type="button" className="keypad-btn btn-clear" onClick={handleClear} disabled={loading}>
                    C
                  </button>
                  <button type="button" className="keypad-btn" onClick={() => handleKeyPress(0)} disabled={loading}>
                    0
                  </button>
                  <button type="button" className="keypad-btn btn-backspace" onClick={handleBackspace} disabled={loading}>
                    <i className="fa-solid fa-delete-left"></i>
                  </button>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg mt-2" disabled={loading}>
                  {loading ? 'Authentification...' : 'Se Connecter'}
                </button>

                <div className="mt-3 text-center">
                  <button type="button" onClick={() => setLoginMode('standard')} className="btn-link-login">
                    <i className="fa-solid fa-arrow-left me-1"></i> Revenir à la connexion E-mail &amp; Mot de passe
                  </button>
                </div>
              </form>
            )}

            {/* C. Mode Oubli Mot de Passe */}
            {loginMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="standard-form text-left">
                <p className="section-instruction mb-3">
                  Saisissez l'adresse e-mail associée à votre compte pour obtenir un code de réinitialisation.
                </p>
                <div className="form-group mb-3">
                  <label className="form-label" style={{ fontWeight: 700 }}>Adresse E-mail</label>
                  <input 
                    type="email" 
                    className="form-control"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="admin@entreprise.com"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Envoi...' : 'Envoyer le code de réinitialisation'}
                </button>
                <div className="mt-3 text-center">
                  <button type="button" onClick={() => setLoginMode('pin')} className="btn-link-login">
                    <i className="fa-solid fa-arrow-left me-1"></i> Annuler et revenir
                  </button>
                </div>
              </form>
            )}

            {/* D. Mode Réinitialisation */}
            {loginMode === 'reset' && (
              <form onSubmit={handleResetSubmit} className="standard-form text-left">
                <div className="form-group mb-2">
                  <label className="form-label">Code secret récepteur (6 chiffres)</label>
                  <input 
                    type="text" 
                    className="form-control text-center"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                    style={{ letterSpacing: '4px', fontSize: '18px', fontWeight: 800 }}
                  />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Confirmer le mot de passe</label>
                  <input 
                    type="password" 
                    className="form-control"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  Enregistrer le nouveau mot de passe
                </button>
              </form>
            )}

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button type="button" onClick={() => setActiveTab('home')} className="btn-link-back-home">
                <i className="fa-solid fa-arrow-left me-1"></i> Retour à l'accueil
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .login-page-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1;
        }

        .login-box {
          width: 100%;
          max-width: 440px;
          padding: 36px 32px;
          margin-top: 40px;
          box-shadow: var(--shadow-lg);
        }

        .login-logo-img {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        .brand-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
          font-weight: 500;
        }

        .login-mode-toggle {
          display: flex;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 4px;
          margin-bottom: 24px;
        }

        .mode-btn {
          flex: 1;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          background: transparent;
          color: var(--text-muted);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn.active {
          background: var(--bg-card);
          color: var(--color-primary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
        }

        .code-input {
          font-family: var(--font-title);
          border: 2px solid var(--border-color);
          transition: border-color 0.2s;
        }

        .code-input:focus {
          border-color: var(--color-primary);
        }

        .pin-dots-display {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 10px 0;
        }

        .pin-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          transition: all 0.2s;
        }

        .pin-dot.filled {
          background: var(--color-primary);
          border-color: var(--color-primary);
          transform: scale(1.1);
        }

        .pin-keypad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          max-width: 280px;
          margin: 0 auto;
        }

        .keypad-btn {
          height: 48px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-main);
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }

        .keypad-btn:hover {
          background: var(--bg-input);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .keypad-btn.btn-clear {
          color: var(--color-danger);
          font-size: 15px;
        }

        .keypad-btn.btn-backspace {
          color: var(--text-muted);
          font-size: 15px;
        }

        .btn-link-login {
          background: none;
          border: none;
          color: var(--color-primary);
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-size: 13px;
        }

        .btn-link-back-home {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 12px;
          cursor: pointer;
        }

        .user-details-card {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          padding: 20px;
          text-align: center;
        }

        .avatar-large {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          font-size: 24px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }

        .user-name { font-size: 18px; font-weight: 800; margin-bottom: 2px; }
        .user-email { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; }
        .info-item { background: var(--bg-card); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color); }
        .info-label { display: block; font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .info-val { font-size: 12px; font-weight: 700; }

        .badge-role { background: rgba(79,70,229,0.12); color: var(--color-primary); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 700; }
        .badge-tenant { background: rgba(16,185,129,0.12); color: var(--color-success); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 700; }
        .btn-logout { width: 100%; padding: 10px; font-weight: 700; font-size: 13px; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--color-danger); border-radius: var(--border-radius-sm); cursor: pointer; }
      `}</style>
    </div>
  );
};
