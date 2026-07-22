import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const ThemeSelector = () => {
  const { 
    theme, setTheme, 
    uiKit, setUiKit, 
    companyId, setCompanyId,
    branchId, setBranchId 
  } = useApp();

  // État d'ouverture du panneau latéral (Drawer)
  const [isOpen, setIsOpen] = useState(false);

  // États locaux de customisation d'interface (persistance automatique)
  const [density, setDensity] = useState(() => localStorage.getItem('app-density') || 'normal');
  const [borderRadius, setBorderRadius] = useState(() => parseInt(localStorage.getItem('app-border-radius') || '12'));
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('app-accent-color') || '#0F4A86');

  // Synchronisation de la densité
  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    localStorage.setItem('app-density', density);
  }, [density]);

  // Synchronisation du rayon de bordure
  useEffect(() => {
    document.documentElement.style.setProperty('--border-radius-base', `${borderRadius}px`);
    localStorage.setItem('app-border-radius', borderRadius.toString());
  }, [borderRadius]);

  // Synchronisation de la couleur d'accent (primaire)
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', accentColor);
    localStorage.setItem('app-accent-color', accentColor);
  }, [accentColor]);

  return (
    <>
      {/* BOUTON FLOTTANT D'OUVERTURE */}
      <button 
        className="theme-floating-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        title="Configuration de l'interface"
      >
        <i className="fa-solid fa-palette"></i>
      </button>

      {/* PANNEAU LATÉRAL COULISSANT (DRAWER) */}
      <div className={`theme-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}>
        <div className={`theme-drawer-card ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          
          <div className="drawer-header">
            <h3>🎨 Personnalisation</h3>
            <button className="btn-close-drawer" onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="drawer-body">
            
            {/* SECTION 1 : THEME & STYLE */}
            <div className="drawer-section">
              <span className="section-title">Design Global</span>
              
              <div className="drawer-row">
                <label>Style de l'interface</label>
                <select value={uiKit} onChange={(e) => setUiKit(e.target.value)} className="form-control">
                  <option value="corporate">🏢 Corporate</option>
                  <option value="glassmorphism">💎 Glassmorphism</option>
                </select>
              </div>

              <div className="drawer-row">
                <label>Mode</label>
                <div className="theme-toggle-buttons">
                  <button 
                    className={`theme-mode-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    ☀️ Clair
                  </button>
                  <button 
                    className={`theme-mode-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    🌙 Sombre
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 2 : ACCENTS ET GRAPHISME */}
            <div className="drawer-section">
              <span className="section-title">Ajustements Graphiques</span>

              <div className="drawer-row">
                <label>Bordures : {borderRadius}px</label>
                <input 
                  type="range" 
                  min="0" 
                  max="24" 
                  step="2"
                  value={borderRadius} 
                  onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                  className="drawer-slider"
                />
              </div>

              <div className="drawer-row">
                <label>Densité d'affichage</label>
                <select value={density} onChange={(e) => setDensity(e.target.value)} className="form-control">
                  <option value="compact">Compact (Petit)</option>
                  <option value="normal">Normal (Moyen)</option>
                  <option value="spacious">Spacieux (Grand)</option>
                </select>
              </div>

              <div className="drawer-row">
                <label>Couleur primaire</label>
                <div className="color-presets">
                  {['#0F4A86', '#00A651', '#7C3AED', '#EC4899', '#F59E0B'].map(color => (
                    <button 
                      key={color}
                      className={`color-preset-btn ${accentColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setAccentColor(color)}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="custom-color-input"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3 : CONTEXTE DE L'ENTREPRISE (POUR DEV / SUPPORT) */}
            <div className="drawer-section developer-section">
              <span className="section-title">Support & Dev</span>

              <div className="drawer-row">
                <label>Tenant ID</label>
                <input 
                  type="number" 
                  className="form-control text-center"
                  value={companyId} 
                  onChange={(e) => setCompanyId(e.target.value)} 
                  min="1"
                />
              </div>

              <div className="drawer-row">
                <label>Boutique ID</label>
                <input 
                  type="number" 
                  className="form-control text-center"
                  value={branchId} 
                  onChange={(e) => setBranchId(e.target.value)} 
                  min="1"
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        /* TRIGGER FLOTTANT */
        .theme-floating-trigger {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #FFF;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all var(--transition-fast);
        }

        .theme-floating-trigger:hover {
          transform: rotate(45deg) scale(1.1);
        }

        /* OVERLAY ET DRAWER */
        .theme-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .theme-drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .theme-drawer-card {
          position: fixed;
          top: 0;
          right: -320px;
          bottom: 0;
          width: 320px;
          background: var(--bg-card);
          border-left: 1px solid var(--border-color);
          box-shadow: -4px 0 24px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
        }

        .theme-drawer-card.open {
          right: 0;
        }

        .drawer-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
        }

        .drawer-header h3 {
          font-family: var(--font-title);
          font-size: 16px;
          font-weight: 800;
          margin: 0;
          color: var(--text-main);
        }

        .btn-close-drawer {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 20px;
          cursor: pointer;
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          text-align: left;
        }

        .drawer-section {
          margin-bottom: 24px;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 20px;
        }

        .drawer-section:last-child {
          border-bottom: none;
        }

        .section-title {
          font-family: var(--font-title);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          font-weight: 700;
          display: block;
          margin-bottom: 16px;
        }

        .drawer-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .drawer-row label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
        }

        /* BOUTONS TOGGLE */
        .theme-toggle-buttons {
          display: flex;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 3px;
        }

        .theme-mode-btn {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-muted);
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border-radius: calc(var(--border-radius-sm) - 2px);
          transition: all var(--transition-fast);
        }

        .theme-mode-btn.active {
          background: var(--bg-card);
          color: var(--text-main);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* SLIDER */
        .drawer-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          accent-color: var(--color-primary);
        }

        /* PRESETS DE COULEURS */
        .color-presets {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .color-preset-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .color-preset-btn:hover {
          transform: scale(1.15);
        }

        .color-preset-btn.active {
          border-color: var(--text-main);
          transform: scale(1.1);
        }

        .custom-color-input {
          border: none;
          width: 28px;
          height: 28px;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }

        .developer-section {
          background: rgba(0, 0, 0, 0.15);
          border-radius: var(--border-radius-sm);
          padding: 12px;
        }

        /* Force les styles de visibilité du texte dans le drawer en mode sombre */
        [data-theme="dark"] .theme-drawer-card {
          color: #FFFFFF !important;
        }
        [data-theme="dark"] .drawer-header h3,
        [data-theme="dark"] .drawer-row label {
          color: #FFFFFF !important;
        }
        [data-theme="dark"] .section-title,
        [data-theme="dark"] .btn-close-drawer {
          color: #CBD5E1 !important;
        }
        [data-theme="dark"] .theme-mode-btn {
          color: #94A3B8;
        }
        [data-theme="dark"] .theme-mode-btn.active {
          color: #FFFFFF !important;
          background: var(--bg-input) !important;
        }
      `}</style>
    </>
  );
};
