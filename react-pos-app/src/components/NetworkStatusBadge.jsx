import React from 'react';
import { useApp } from '../context/AppContext';

export const NetworkStatusBadge = () => {
  const { isOnline, pendingSalesCount, isSyncing, syncOfflineSales } = useApp();

  if (isSyncing) {
    return (
      <div 
        className="badge bg-primary text-white d-flex align-items-center gap-2 px-3 py-2" 
        style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600, boxShadow: '0 2px 8px rgba(15,74,134,0.3)' }}
      >
        <i className="fa-solid fa-arrows-rotate fa-spin"></i>
        <span>Synchronisation en cours...</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div 
        className="badge bg-danger text-white d-flex align-items-center gap-2 px-3 py-2" 
        style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600, boxShadow: '0 2px 8px rgba(220,53,69,0.3)' }}
        title="Mode Hors-Ligne actif. Vos ventes sont enregistrées localement."
      >
        <span className="spinner-grow spinner-grow-sm" role="status" style={{ width: '8px', height: '8px' }}></span>
        <span>🔴 Hors ligne {pendingSalesCount > 0 && `(${pendingSalesCount} vente${pendingSalesCount > 1 ? 's' : ''} en attente)`}</span>
      </div>
    );
  }

  if (pendingSalesCount > 0) {
    return (
      <button 
        type="button" 
        onClick={syncOfflineSales} 
        className="badge bg-warning text-dark border-0 d-flex align-items-center gap-2 px-3 py-2 cursor-pointer" 
        style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 8px rgba(255,193,7,0.4)', cursor: 'pointer' }}
        title="Cliquez pour synchroniser les ventes hors-ligne maintenant"
      >
        <i className="fa-solid fa-cloud-arrow-up"></i>
        <span>Synchroniser {pendingSalesCount} vente{pendingSalesCount > 1 ? 's' : ''}</span>
      </button>
    );
  }

  return (
    <div 
      className="badge bg-success-subtle text-success border border-success-subtle d-flex align-items-center gap-2 px-3 py-2" 
      style={{ borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}
      title="Connexion réseau établie. Système connecté en direct à l'API."
    >
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#198754', display: 'inline-block' }}></span>
      <span>🟢 En ligne</span>
    </div>
  );
};
