import React, { useEffect, useRef } from 'react';

/**
 * SlidePanel — Interface / Page de Formulaire Plein Écran
 * Remplace les popups et panneaux modaux par une véritable interface plein écran (100% de l'écran).
 *
 * Props:
 *   isOpen    {boolean}   — Contrôle l'affichage de l'interface plein écran
 *   onClose   {function}  — Ferme l'interface et retourne à la liste
 *   title     {string}    — Titre de l'interface (ex: "Nouveau produit")
 *   subtitle  {string}    — Sous-titre explicatif
 *   icon      {string}    — Classe Font Awesome de l'icône (ex: "fa-solid fa-box")
 *   iconColor {string}    — Couleur de l'icône
 *   children  {node}      — Contenu du formulaire
 *   footer    {node}      — Boutons d'action fixes (Annuler / Enregistrer)
 *   maxWidth  {string}    — Largeur max du conteneur de formulaire (défaut: "1100px")
 */
export const SlidePanel = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconColor = 'var(--color-primary, #6366f1)',
  children,
  footer,
  maxWidth = '1100px'
}) => {
  const panelRef = useRef(null);

  // Fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Masquer le scroll du fond
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fullpage-form-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'var(--bg-main, #0f172a)',
        color: 'var(--text-main, #f8fafc)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fullpageFadeIn 0.22s ease-out'
      }}
    >
      {/* ── BARRE D'EN-TÊTE PLEIN ÉCRAN ── */}
      <header
        style={{
          background: 'var(--bg-card, #1e293b)',
          borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexShrink: 0,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        {/* Bouton Retour & Titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '13px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'var(--bg-input, rgba(255,255,255,0.05))',
              border: '1px solid var(--border-color, rgba(255,255,255,0.12))',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'all 0.18s',
              flexShrink: 0
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Retour à la liste</span>
          </button>

          <div style={{ width: '1px', height: '28px', background: 'var(--border-color, rgba(255,255,255,0.1))' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            {icon && (
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: `${iconColor}22`,
                border: `1.5px solid ${iconColor}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <i className={icon} style={{ color: iconColor, fontSize: '18px' }}></i>
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <h2 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {title}
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #94a3b8)' }}>
                {subtitle || "Formulaire d'enregistrement et de modification"}
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de fermeture d'urgence */}
        <button
          type="button"
          onClick={onClose}
          title="Fermer (Échap)"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.18s'
          }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: '16px' }}></i>
        </button>
      </header>

      {/* ── CORPS DU FORMULAIRE PLEIN ÉCRAN ── */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px 24px',
          background: 'var(--bg-main, #0f172a)'
        }}
      >
        <div
          style={{
            maxWidth: maxWidth,
            margin: '0 auto',
            background: 'var(--bg-card, #1e293b)',
            borderRadius: '16px',
            border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            padding: '32px'
          }}
        >
          {children}
        </div>
      </main>

      {/* ── PIED DE PAGE FIXE AVEC BOUTONS ── */}
      {footer && (
        <footer
          style={{
            background: 'var(--bg-card, #1e293b)',
            borderTop: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            padding: '16px 28px',
            flexShrink: 0,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
          }}
        >
          <div
            style={{
              maxWidth: maxWidth,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            {footer}
          </div>
        </footer>
      )}

      <style>{`
        @keyframes fullpageFadeIn {
          from { opacity: 0; transform: scale(0.99); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
