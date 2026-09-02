import React, { useEffect, useRef } from 'react';

/**
 * SlidePanel — Panneau glissant latéral (remplace les modals pour les formulaires d'ajout/modification)
 * 
 * Props:
 *   isOpen   {boolean}   — Contrôle l'affichage du panneau
 *   onClose  {function}  — Ferme le panneau
 *   title    {string}    — Titre affiché dans l'en-tête du panneau
 *   icon     {string}    — Classe Font Awesome de l'icône (ex: "fa-solid fa-box")
 *   iconColor{string}    — Couleur CSS de l'icône
 *   children {node}      — Contenu du panneau (formulaire, erreurs, etc.)
 *   size     {string}    — 'sm' | 'md' | 'lg' (largeur du panneau, défaut: 'md')
 *   footer   {node}      — Contenu fixe en bas du panneau (boutons d'action)
 */
export const SlidePanel = ({ isOpen, onClose, title, icon, iconColor = 'var(--color-primary)', children, size = 'md', footer }) => {
  const panelRef = useRef(null);

  // Fermeture avec la touche Echap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Bloquer le scroll de la page quand le panneau est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const widths = { sm: '480px', md: '600px', lg: '760px' };
  const panelWidth = widths[size] || widths.md;

  return (
    <>
      {/* ── Overlay (fond assombri) ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-hidden="true"
      />

      {/* ── Panneau glissant ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 10001,
          width: '100%',
          maxWidth: panelWidth,
          background: 'var(--bg-card, #1e293b)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          borderLeft: '1px solid var(--border-color, rgba(255,255,255,0.08))',
          overflowX: 'hidden',
        }}
      >
        {/* ── En-tête ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
          flexShrink: 0,
          background: 'var(--bg-sidebar, rgba(15,23,42,0.6))',
        }}>
          {/* Bouton retour */}
          <button
            type="button"
            onClick={onClose}
            title="Retour à la liste"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-input, rgba(255,255,255,0.06))',
              border: '1.5px solid var(--border-color, rgba(255,255,255,0.1))',
              color: 'var(--text-main)',
              borderRadius: '10px',
              padding: '7px 14px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.18s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover, rgba(255,255,255,0.1))'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-input, rgba(255,255,255,0.06))'; }}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: '12px' }}></i>
            Retour
          </button>

          {/* Titre + Icône */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            {icon && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `${iconColor}22`,
                border: `1.5px solid ${iconColor}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className={icon} style={{ color: iconColor, fontSize: '15px' }}></i>
              </div>
            )}
            <h2 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--text-main)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {title}
            </h2>
          </div>

          {/* Bouton fermeture ✕ */}
          <button
            type="button"
            onClick={onClose}
            title="Fermer"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1.5px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: '14px' }}></i>
          </button>
        </div>

        {/* ── Contenu défilable ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px',
        }}>
          {children}
        </div>

        {/* ── Pied de page fixe (boutons d'action) ── */}
        {footer && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            flexShrink: 0,
            background: 'var(--bg-sidebar, rgba(15,23,42,0.6))',
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
          }}>
            {footer}
          </div>
        )}
      </div>

      {/* ── CSS Responsive Mobile : panneau depuis le bas ── */}
      <style>{`
        @media (max-width: 640px) {
          [aria-label="${title}"] {
            top: auto !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            border-left: none !important;
            border-top: 1px solid var(--border-color, rgba(255,255,255,0.08)) !important;
            border-radius: 20px 20px 0 0 !important;
            max-height: 95dvh !important;
            transform: ${isOpen ? 'translateY(0)' : 'translateY(100%)'} !important;
          }
        }
      `}</style>
    </>
  );
};
