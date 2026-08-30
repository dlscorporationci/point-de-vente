import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export const BarcodeScannerModal = ({ isOpen, onClose, onScanSuccess, title = "Scanner un Code-Barres par Caméra" }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [scannedCode, setScannedCode] = useState(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage(null);
    setScannedCode(null);

    const regionId = "barcode-camera-scanner-region";
    const formatsToSupport = [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.ITF,
    ];

    const html5Qrcode = new Html5Qrcode(regionId, { formatsToSupport });
    html5QrcodeScannerRef.current = html5Qrcode;

    const config = {
      fps: 15,
      qrbox: { width: 260, height: 160 },
      aspectRatio: 1.0,
    };

    const handleSuccess = (decodedText) => {
      // Vibration haptique sur smartphone
      if (navigator.vibrate) {
        try { navigator.vibrate([80, 50, 80]); } catch { /* silencieux */ }
      }

      setScannedCode(decodedText);

      if (html5QrcodeScannerRef.current && html5QrcodeScannerRef.current.isScanning) {
        html5QrcodeScannerRef.current.stop().catch(() => {});
      }

      setTimeout(() => {
        onScanSuccess(decodedText);
        onClose();
      }, 800);
    };

    const handleError = () => {
      // Ignorer les échecs de lecture d'image frame par frame
    };

    // Démarrer avec la caméra arrière (environment) sur mobile
    html5Qrcode.start(
      { facingMode: "environment" },
      config,
      handleSuccess,
      handleError
    ).catch((err) => {
      console.warn("Erreur accès caméra arrière, tentative caméra par défaut...", err);
      html5Qrcode.start(
        { facingMode: "user" },
        config,
        handleSuccess,
        handleError
      ).catch((fallbackErr) => {
        console.error("Impossible de démarrer la caméra:", fallbackErr);
        setErrorMessage("Impossible d'accéder à la caméra de votre téléphone. Assurez-vous d'avoir autorisé l'accès à la caméra dans votre navigateur (Chrome/Safari).");
      });
    });

    return () => {
      if (html5QrcodeScannerRef.current) {
        if (html5QrcodeScannerRef.current.isScanning) {
          html5QrcodeScannerRef.current.stop().catch(() => {});
        }
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div className="modal-card card" style={{ maxWidth: '440px', width: '95vw', padding: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '17px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-camera"></i> {title}
          </h3>
          <button className="btn btn-outline" onClick={onClose} style={{ padding: '4px 8px' }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {scannedCode && (
          <div className="alert alert-success" style={{ background: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontWeight: 700 }}>
            ✅ Code détecté : {scannedCode}
          </div>
        )}

        {errorMessage ? (
          <div className="alert alert-danger mb-3" style={{ padding: '14px', textAlign: 'left' }}>
            <i className="fa-solid fa-triangle-exclamation me-2"></i> {errorMessage}
            <div className="mt-2 text-muted small">
              💡 <strong>Astuce :</strong> Vous pouvez également brancher un lecteur douchette USB/Bluetooth ou saisir le code manuellement.
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Orientez le viseur de la caméra vers le code-barres de l'article.
          </p>
        )}

        {/* Zone de rendu vidéo caméra */}
        <div 
          id="barcode-camera-scanner-region" 
          style={{ 
            width: '100%', 
            minHeight: '260px', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            background: '#0f172a',
            border: '2px solid var(--color-primary)'
          }}
        ></div>

        <div className="mt-3 text-end">
          <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
            Fermer le scanner
          </button>
        </div>
      </div>
    </div>
  );
};
