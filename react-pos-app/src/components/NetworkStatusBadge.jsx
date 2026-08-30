import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const NetworkStatusBadge = () => {
  const { isOnline, pendingSalesCount, isSyncing, syncOfflineSales, realtimeStatus } = useApp();
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

  const getTooltipText = () => {
    if (!isOnline) return "Mode Hors-Ligne actif. Vos opérations sont conservées en local.";
    if (isSyncing) return "Synchronisation des données en cours...";
    if (realtimeStatus === 'connected') return "Connexion réseau & temps réel SSE établies avec le serveur.";
    if (realtimeStatus === 'connecting') return "Reconnexion au flux temps réel en cours...";
    return "Connexion réseau active. Canal temps réel déconnecté.";
  };

  return (
    <div className="d-flex align-items-center gap-2">
      {deferredPrompt && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="btn btn-outline-primary btn-sm d-none d-md-inline-flex align-items-center gap-1"
          style={{ borderRadius: '20px', fontSize: '11px', fontWeight: 700, padding: '4px 10px' }}
          title="Installer l'application DLS POS sur cet appareil"
        >
          <i className="fa-solid fa-download text-primary"></i>
          <span>Installer l'App</span>
        </button>
      )}

      {isSyncing ? (
        <div 
          className="badge bg-primary text-white d-flex align-items-center gap-1 px-2 px-md-3 py-2" 
          style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600, boxShadow: '0 2px 8px rgba(15,74,134,0.3)' }}
          title={getTooltipText()}
        >
          <i className="fa-solid fa-arrows-rotate fa-spin"></i>
          <span className="d-none d-md-inline">Synchronisation...</span>
        </div>
      ) : !isOnline ? (
        <div 
          className="badge bg-danger text-white d-flex align-items-center gap-1 px-2 px-md-3 py-2" 
          style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600, boxShadow: '0 2px 8px rgba(220,53,69,0.3)' }}
          title={getTooltipText()}
        >
          <span className="spinner-grow spinner-grow-sm" role="status" style={{ width: '8px', height: '8px' }}></span>
          <span className="d-none d-md-inline">🔴 Hors ligne {pendingSalesCount > 0 && `(${pendingSalesCount} vente${pendingSalesCount > 1 ? 's' : ''})`}</span>
          <span className="d-inline d-md-none">🔴 {pendingSalesCount > 0 && pendingSalesCount}</span>
        </div>
      ) : pendingSalesCount > 0 ? (
        <button 
          type="button" 
          onClick={syncOfflineSales} 
          className="badge bg-warning text-dark border-0 d-flex align-items-center gap-1 px-2 px-md-3 py-2 cursor-pointer" 
          style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 8px rgba(255,193,7,0.4)', cursor: 'pointer' }}
          title="Cliquez pour synchroniser les ventes hors-ligne maintenant"
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
          <span>Sync {pendingSalesCount}</span>
        </button>
      ) : realtimeStatus === 'connecting' ? (
        <div 
          className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle d-flex align-items-center gap-1 px-2 px-md-3 py-2" 
          style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}
          title={getTooltipText()}
        >
          <i className="fa-solid fa-sync fa-spin"></i>
          <span className="d-none d-md-inline">🟡 En ligne · Sync...</span>
        </div>
      ) : (
        <div 
          className="badge bg-success-subtle text-success border border-success-subtle d-flex align-items-center gap-1 px-2 px-md-3 py-2" 
          style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}
          title={getTooltipText()}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#198754', display: 'inline-block' }}></span>
          <span className="d-none d-md-inline">🟢 En ligne · Synchronisé</span>
        </div>
      )}
    </div>
  );
};
