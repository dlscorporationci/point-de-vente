import React, { useEffect } from 'react';

/**
 * ConfirmDialog — Dialog de confirmation personnalisé (remplace window.confirm())
 *
 * Props:
 *   isOpen       {boolean}   — Contrôle l'affichage du dialog
 *   title        {string}    — Titre du dialog (ex: "Supprimer ce produit ?")
 *   message      {string}    — Message de description contextuel
 *   confirmLabel {string}    — Texte du bouton de confirmation (défaut: "Supprimer")
 *   cancelLabel  {string}    — Texte du bouton d'annulation (défaut: "Annuler")
 *   onConfirm    {function}  — Callback confirmé
 *   onCancel     {function}  — Callback annulé / fermeture
 *   type         {string}    — 'danger' | 'warning' | 'info' (défaut: 'danger')
 *   loading      {boolean}   — Affiche un spinner sur le bouton de confirmation
 */
export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
  type = 'danger',
  loading = false,
}) => {

  // Fermeture avec la touche Echap
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && isOpen) onCancel?.(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  // Bloquer le scroll de la page
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const config = {
    danger: {
      icon: 'fa-solid fa-triangle-exclamation',
      iconBg: 'rgba(239, 68, 68, 0.12)',
      iconColor: '#ef4444',
      btnBg: 'linear-gradient(135deg, #dc2626, #ef4444)',
      btnShadow: 'rgba(239, 68, 68, 0.35)',
      defaultLabel: 'Supprimer définitivement',
      confirmIcon: 'fa-solid fa-trash',
    },
    warning: {
      icon: 'fa-solid fa-circle-exclamation',
      iconBg: 'rgba(245, 158, 11, 0.12)',
      iconColor: '#f59e0b',
      btnBg: 'linear-gradient(135deg, #d97706, #f59e0b)',
      btnShadow: 'rgba(245, 158, 11, 0.35)',
      defaultLabel: 'Confirmer',
      confirmIcon: 'fa-solid fa-check',
    },
    info: {
      icon: 'fa-solid fa-circle-info',
      iconBg: 'rgba(37, 99, 235, 0.12)',
      iconColor: '#2563eb',
      btnBg: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
      btnShadow: 'rgba(37, 99, 235, 0.35)',
      defaultLabel: 'Confirmer',
      confirmIcon: 'fa-solid fa-check',
    },
  }[type] || config?.danger;

  const label = confirmLabel || config.defaultLabel;

  return (
    <>
      {/* ── Overlay ── */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 20000,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'confirmOverlayIn 0.2s ease',
        }}
        aria-hidden="true"
      />

      {/* ── Dialog ── */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 20001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'var(--bg-card, #1e293b)',
            borderRadius: '20px',
            border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px ${config.iconColor}22`,
            padding: '32px 28px',
            width: '100%',
            maxWidth: '420px',
            textAlign: 'center',
            pointerEvents: 'auto',
            animation: 'confirmDialogIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icône */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: config.iconBg,
            border: `2px solid ${config.iconColor}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
          }}>
            <i className={config.icon} style={{ fontSize: '26px', color: config.iconColor }}></i>
          </div>

          {/* Titre */}
          <h3
            id="confirm-dialog-title"
            style={{
              margin: '0 0 10px 0',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-main)',
            }}
          >
            {title || 'Confirmer l\'action'}
          </h3>

          {/* Message */}
          {message && (
            <p
              id="confirm-dialog-message"
              style={{
                margin: '0 0 28px 0',
                fontSize: '14px',
                color: 'var(--text-muted, #94a3b8)',
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>
          )}

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {/* Annuler */}
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                padding: '11px 20px',
                borderRadius: '12px',
                background: 'var(--bg-input, rgba(255,255,255,0.06))',
                border: '1.5px solid var(--border-color, rgba(255,255,255,0.1))',
                color: 'var(--text-main)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <i className="fa-solid fa-xmark"></i>
              {cancelLabel}
            </button>

            {/* Confirmer */}
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                padding: '11px 20px',
                borderRadius: '12px',
                background: loading ? 'var(--bg-input)' : config.btnBg,
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s',
                boxShadow: loading ? 'none' : `0 4px 16px ${config.btnShadow}`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading
                ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Traitement...</>
                : <><i className={config.confirmIcon}></i> {label}</>
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Animations ── */}
      <style>{`
        @keyframes confirmOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes confirmDialogIn {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
};
