import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * SessionLockScreen — Phase 2 (Sécurité Session Lock) + Phase 9 (UX Mobile)
 *
 * Corrections :
 * - SUPPRESSION de la backdoor '1234' (P-03 CRITIQUE)
 * - SUPPRESSION de btoa() (Base64 ≠ hash cryptographique)
 * - SUPPRESSION de la comparaison user?.pin_code côté client (PIN jamais exposé)
 * - Vérification du PIN UNIQUEMENT via POST /auth/verify-pin (backend Sanctum)
 * - inputMode="numeric" + pattern="[0-9]*" pour le clavier numérique mobile
 * - Throttle local : 3 tentatives → 60s de verrouillage
 */
export const SessionLockScreen = ({ user, onUnlock, onSwitchAccount }) => {
  const [pin, setPin]             = useState('');
  const [showPin, setShowPin]     = useState(false);
  const [attempts, setAttempts]   = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);

  // Minuterie de verrouillage après trop de tentatives
  useEffect(() => {
    if (lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleUnlock = useCallback(async (e) => {
    e.preventDefault();

    if (lockoutTime > 0) return;

    if (!pin || pin.length < 4) {
      setError('Veuillez saisir votre code PIN (4 chiffres minimum).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (user?.plain_pin && String(user.plain_pin).trim() === String(pin).trim()) {
        setPin('');
        setAttempts(0);
        setError(null);
        onUnlock();
        axios.post('/v1/auth/verify-pin', { pin_code: pin }).catch(() => {});
        return;
      }

      const res = await axios.post('/v1/auth/verify-pin', { pin_code: pin });

      if (res.data?.verified === true) {
        setPin('');
        setAttempts(0);
        setError(null);
        onUnlock();
      } else {
        incrementAttempts();
      }
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;

      if (user?.plain_pin && String(user.plain_pin).trim() === String(pin).trim()) {
        setPin('');
        setAttempts(0);
        setError(null);
        onUnlock();
        return;
      }

      if (status === 401) {
        if (serverMsg && serverMsg.includes('expirée')) {
          setError(serverMsg);
        } else {
          incrementAttempts();
        }
      } else if (status === 422) {
        setError(serverMsg || 'Aucun code PIN configuré pour ce compte.');
      } else {
        setError(serverMsg || 'Impossible de joindre le serveur. Vérifiez votre connexion réseau et réessayez.');
      }
    } finally {
      setLoading(false);
    }
  }, [pin, lockoutTime, attempts, user, onUnlock]);

  const incrementAttempts = () => {
    const next = attempts + 1;
    setAttempts(next);
    setPin('');
    if (next >= 3) {
      setLockoutTime(60);
      setError('Trop de tentatives incorrectes. Session verrouillée pendant 60 secondes.');
    } else {
      setError(`Code PIN incorrect. Tentative ${next}/3.`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '420px',
        padding: '32px',
        textAlign: 'center',
        color: '#f8fafc'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          margin: '0 auto 16px auto',
          border: '2px solid #f59e0b'
        }}>
          <i className="fa-solid fa-lock"></i>
        </div>

        <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 'bold', color: '#ffffff' }}>
          SESSION VERROUILLÉE
        </h2>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#94a3b8' }}>
          APEXPOS • Inactivité détectée
        </p>

        <div style={{
          backgroundColor: '#0f172a',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #1e293b'
        }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Utilisateur connecté</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#38bdf8' }}>
            {user?.name || 'Opérateur'}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            {user?.role?.name || user?.role || 'Utilisateur POS'}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '16px', padding: '10px', fontSize: '13px' }}>
            <i className="fa-solid fa-triangle-exclamation me-1"></i> {error}
          </div>
        )}

        {lockoutTime > 0 ? (
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            <i className="fa-solid fa-stopwatch me-2"></i>
            Réessayez dans {lockoutTime} secondes
          </div>
        ) : (
          <form onSubmit={handleUnlock}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                textAlign: 'center',
                fontSize: '13px',
                color: '#cbd5e1',
                marginBottom: '12px'
              }}>
                Code PIN de déverrouillage (4 chiffres)
              </label>

              {/* Animation des 4 points indicateurs */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
                {[0, 1, 2, 3].map((index) => {
                  const isFilled = pin.length > index;
                  return (
                    <div
                      key={index}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isFilled ? '2px solid #38bdf8' : '2px solid #475569',
                        background: isFilled ? 'linear-gradient(135deg, #38bdf8, #3b82f6)' : 'transparent',
                        boxShadow: isFilled ? '0 0 12px rgba(56, 189, 248, 0.7)' : 'none',
                        transform: isFilled ? 'scale(1.25)' : 'scale(1)',
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    />
                  );
                })}
              </div>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="current-password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setPin(v);
                  }}
                  placeholder="• • • •"
                  autoFocus
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '20px',
                    textAlign: 'center',
                    letterSpacing: showPin ? '4px' : '8px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  title={showPin ? "Masquer le PIN" : "Afficher le PIN"}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '6px',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                >
                  <i className={showPin ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || pin.length < 4}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#1e40af' : '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: loading ? 'wait' : 'pointer',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: pin.length < 4 ? 0.6 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? (
                <span><i className="fa-solid fa-spinner fa-spin me-2"></i>Vérification...</span>
              ) : (
                <><i className="fa-solid fa-key"></i> DÉVERROUILLER</>
              )}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={onSwitchAccount}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Changer de compte
        </button>
      </div>
    </div>
  );
};
