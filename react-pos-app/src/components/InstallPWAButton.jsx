import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const InstallPWAButton = ({ isMobileDrawer = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Détecter si déjà en mode PWA standalone (installé)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Si l'événement natif n'est pas prêt ou sur iOS Safari, ouvrir la modale d'aide
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return null; // Masquer si l'application est déjà installée et ouverte en PWA
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={isMobileDrawer ? 'btn-install-pwa-drawer' : 'btn-install-pwa-navbar'}
        title="Télécharger / Installer l'Application Mobile dls POS"
      >
        <i className="fa-solid fa-mobile-screen-button me-1"></i>
        <span>{isMobileDrawer ? "Installer l'Application Mobile" : "Installer App"}</span>
      </button>

      {/* Modale d'instructions pour l'installation sur mobile (Attachée au body via createPortal) */}
      {showModal && createPortal(
        <div className="modal-overlay pwa-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card card pwa-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '20px', fontWeight: 800 }}>
                <i className="fa-solid fa-mobile-screen-button text-primary"></i>
                Installer dls POS Mobile
              </h3>
              <button 
                type="button" 
                className="btn-close text-reset" 
                onClick={() => setShowModal(false)}
                aria-label="Fermer"
              />
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Accédez à dls POS en 1 clic directement depuis l'écran d'accueil de votre téléphone ou tablette, même hors connexion !
            </p>

            <div className="pwa-guide-box mb-3">
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                <i className="fa-brands fa-android me-1"></i> Sur Android (Chrome / Edge)
              </h5>
              <ol style={{ fontSize: '13px', paddingLeft: '20px', margin: 0, lineHeight: 1.6 }}>
                <li>Appuyez sur les <strong>3 points (⋮)</strong> en haut à droite du navigateur.</li>
                <li>Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</li>
                <li>Validez pour créer le raccourci sur votre téléphone.</li>
              </ol>
            </div>

            <div className="pwa-guide-box mb-4">
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                <i className="fa-brands fa-apple me-1"></i> Sur iPhone / iPad (Safari)
              </h5>
              <ol style={{ fontSize: '13px', paddingLeft: '20px', margin: 0, lineHeight: 1.6 }}>
                <li>Appuyez sur le bouton <strong>Partager (<i className="fa-solid fa-share-nodes"></i>)</strong> au bas de l'écran.</li>
                <li>Faites défiler puis touchez <strong>« Sur l'écran d'accueil »</strong>.</li>
                <li>Appuyez sur <strong>« Ajouter »</strong> en haut à droite.</li>
              </ol>
            </div>

            <div className="modal-actions m-0">
              <button onClick={() => setShowModal(false)} className="btn btn-primary w-100 py-2" style={{ fontWeight: 800 }}>
                Compris !
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .btn-install-pwa-navbar {
          background: linear-gradient(135deg, #2563eb, #10b981);
          color: #ffffff;
          border: none;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-install-pwa-navbar:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }

        .btn-install-pwa-drawer {
          width: 100%;
          background: linear-gradient(135deg, #2563eb, #10b981);
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .pwa-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(15, 23, 42, 0.65) !important;
          backdrop-filter: blur(6px) !important;
          -webkit-backdrop-filter: blur(6px) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 999999 !important;
          padding: 16px !important;
          box-sizing: border-box !important;
        }

        .pwa-modal-card {
          width: 100% !important;
          max-width: 480px !important;
          max-height: 90vh !important;
          overflow-y: auto !important;
          background: var(--bg-card, #ffffff) !important;
          border: 1px solid var(--border-color, #e2e8f0) !important;
          border-radius: 20px !important;
          padding: 28px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          margin: auto !important;
          box-sizing: border-box !important;
          position: relative !important;
        }

        .pwa-guide-box {
          background: var(--bg-input, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          padding: 14px 16px;
        }
      `}</style>
    </>
  );
};
