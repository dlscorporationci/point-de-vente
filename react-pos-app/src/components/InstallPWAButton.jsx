import React, { useState, useEffect } from 'react';

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
        title="Télécharger / Installer l'Application Mobile ApexPOS"
      >
        <i className="fa-solid fa-mobile-screen-button me-1"></i>
        <span>{isMobileDrawer ? "Installer l'Application Mobile" : "Installer App"}</span>
      </button>

      {/* Modale d'instructions pour l'installation sur mobile */}
      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 4000 }} onClick={() => setShowModal(false)}>
          <div className="modal-card card" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-mobile-screen-button text-primary"></i>
              Installer ApexPOS Mobile
            </h3>
            
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Accédez à ApexPOS en 1 clic directement depuis l'écran d'accueil de votre téléphone ou tablette, même hors connexion !
            </p>

            <div className="pwa-guide-box mb-3">
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                <i className="fa-brands fa-android me-1"></i> Sur Android (Chrome / Edge)
              </h5>
              <ol style={{ fontSize: '13px', paddingLeft: '20px', margin: 0 }}>
                <li>Appuyez sur les <strong>3 points (⋮)</strong> en haut à droite du navigateur.</li>
                <li>Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</li>
                <li>Validez pour créer le raccourci sur votre téléphone.</li>
              </ol>
            </div>

            <div className="pwa-guide-box mb-3">
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                <i className="fa-brands fa-apple me-1"></i> Sur iPhone / iPad (Safari)
              </h5>
              <ol style={{ fontSize: '13px', paddingLeft: '20px', margin: 0 }}>
                <li>Appuyez sur le bouton <strong>Partager (<i className="fa-solid fa-share-nodes"></i>)</strong> au bas de l'écran.</li>
                <li>Faites défiler puis touchez <strong>« Sur l'écran d'accueil »</strong>.</li>
                <li>Appuyez sur <strong>« Ajouter »</strong> en haut à droite.</li>
              </ol>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn btn-primary w-100">
                Compris !
              </button>
            </div>
          </div>
        </div>
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

        .pwa-guide-box {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 12px 14px;
        }
      `}</style>
    </>
  );
};
