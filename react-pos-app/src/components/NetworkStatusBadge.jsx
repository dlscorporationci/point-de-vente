import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const NetworkStatusBadge = () => {
  const { isOnline, pendingSalesCount, isSyncing, syncOfflineSales } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      {deferredPrompt && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
          style={{ borderRadius: '20px', fontSize: '11px', fontWeight: 700, padding: '4px 10px' }}
          title="Installer l'application ApexPOS sur cet appareil"
        >
          <i className="fa-solid fa-download text-primary"></i>
          <span>Installer l'App</span>
        </button>
      )}

      {isSyncing ? (
        <div 
          className="badge bg-primary text-white d-flex align-items-center gap-2 px-3 py-2" 
          style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600, boxShadow: '0 2px 8px rgba(15,74,134,0.3)' }}
        >
          <i className="fa-solid fa-arrows-rotate fa-spin"></i>
          <span>Synchronisation...</span>
        </div>
      ) : !isOnline ? (
        <div 
          className="badge bg-danger text-white d-flex align-items-center gap-2 px-3 py-2" 
          style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600, boxShadow: '0 2px 8px rgba(220,53,69,0.3)' }}
          title="Mode Hors-Ligne actif. Vos ventes sont enregistrées localement."
        >
          <span className="spinner-grow spinner-grow-sm" role="status" style={{ width: '8px', height: '8px' }}></span>
          <span>🔴 Hors ligne {pendingSalesCount > 0 && `(${pendingSalesCount} vente${pendingSalesCount > 1 ? 's' : ''})`}</span>
        </div>
      ) : pendingSalesCount > 0 ? (
        <button 
          type="button" 
          onClick={syncOfflineSales} 
          className="badge bg-warning text-dark border-0 d-flex align-items-center gap-2 px-3 py-2 cursor-pointer" 
          style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 8px rgba(255,193,7,0.4)', cursor: 'pointer' }}
          title="Cliquez pour synchroniser les ventes hors-ligne maintenant"
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
          <span>Sync {pendingSalesCount} vente{pendingSalesCount > 1 ? 's' : ''}</span>
        </button>
      ) : (
        <div 
          className="badge bg-success-subtle text-success border border-success-subtle d-flex align-items-center gap-2 px-3 py-2" 
          style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}
          title="Connexion réseau établie. Système connecté en direct à l'API."
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#198754', display: 'inline-block' }}></span>
          <span>🟢 En ligne</span>
        </div>
      )}
    </div>
  );
};
