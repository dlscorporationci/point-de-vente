import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo.jpg';

export function VerifyEmail({ onNavigate }) {
  const { user, token, logout, checkAuthStatus } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Masquer l'adresse e-mail (ex: contact@entreprise.com => c***t@entreprise.com)
  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return email || '';
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `${name.charAt(0)}*@${domain}`;
    return `${name.charAt(0)}${'*'.repeat(name.length - 2)}${name.charAt(name.length - 1)}@${domain}`;
  };

  const targetEmail = user?.email || new URLSearchParams(window.location.search).get('email') || '';

  // Timer du Cooldown pour le bouton Renvoyer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Si l'URL contient un jeton de vérification, lancer la validation automatique
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const emailParam = params.get('email') || user?.email;

    if (tokenParam && emailParam) {
      handleVerifyToken(tokenParam, emailParam);
    }
  }, []);

  const handleVerifyToken = async (tokenVal, emailVal) => {
    setLoading(true);
    setErrorMessage('');
    setStatusMessage('Validation de votre jeton de vérification en cours...');

    try {
      const response = await axios.post('/v1/auth/verify-email', { token: tokenVal, email: emailVal });
      const data = response.data;

      if (data && data.success) {
        setSuccess(true);
        setStatusMessage(data.message || 'Votre adresse e-mail a été vérifiée avec succès ! Votre compte est désormais actif.');
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
        if (checkAuthStatus) {
          await checkAuthStatus();
        }
      } else {
        setSuccess(false);
        setErrorMessage(data.error || 'Échec de la vérification. Le jeton est invalide ou a expiré.');
      }
    } catch (err) {
      console.error('Erreur verify-email:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Échec de la vérification. Le jeton est invalide ou a expiré.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || resendLoading) return;

    setResendLoading(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const response = await axios.post('/v1/auth/resend-verification-email', { email: targetEmail });
      const data = response.data;

      setStatusMessage(data.message || 'Un nouvel e-mail de vérification vous a été envoyé.');
      setResendCooldown(60);
    } catch (err) {
      console.error('Erreur resend-verification:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la demande de renvoi.';
      setErrorMessage(msg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
        border: '1px solid #334155',
        textAlign: 'center'
      }}>
        <img src={logo} alt="ApexPOS Logo" style={{ height: '54px', borderRadius: '10px', marginBottom: '20px' }} />
        
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#f8fafc', margin: '0 0 12px' }}>
          Vérification d'adresse e-mail
        </h2>

        {targetEmail && (
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 24px' }}>
            Un lien de vérification a été envoyé à l'adresse :<br />
            <strong style={{ color: '#38bdf8' }}>{maskEmail(targetEmail)}</strong>
          </p>
        )}

        {loading && (
          <div style={{ padding: '20px', color: '#38bdf8', fontSize: '15px' }}>
            ⏳ {statusMessage}
          </div>
        )}

        {!loading && success && (
          <div style={{
            backgroundColor: '#064e3b',
            color: '#34d399',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #059669',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ✅ {statusMessage}
          </div>
        )}

        {!loading && errorMessage && (
          <div style={{
            backgroundColor: '#7f1d1d',
            color: '#fca5a5',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #dc2626',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {!loading && !success && statusMessage && (
          <div style={{
            backgroundColor: '#1e3a8a',
            color: '#93c5fd',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid #2563eb',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ℹ️ {statusMessage}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          {success ? (
            <button
              onClick={() => {
                if (user) {
                  onNavigate('dashboard');
                } else {
                  onNavigate('auth');
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Accéder à l'application ApexPOS
            </button>
          ) : (
            <button
              onClick={handleResendEmail}
              disabled={resendCooldown > 0 || resendLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: resendCooldown > 0 || resendLoading ? '#334155' : '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: resendCooldown > 0 || resendLoading ? 'not-allowed' : 'pointer',
                fontSize: '15px'
              }}
            >
              {resendLoading ? 'Envoi en cours...' : resendCooldown > 0 ? `Renvoyer l'e-mail (${resendCooldown}s)` : 'Renvoyer l\'e-mail de vérification'}
            </button>
          )}

          {user && (
            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                border: '1px solid #475569',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Se déconnecter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
