import React, { useState, useEffect, useRef } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { ThemeSelector } from './components/ThemeSelector'
import { Login } from './pages/Login'
import { Catalog } from './pages/Catalog'
import { Suppliers } from './pages/Suppliers'
import { Customers } from './pages/Customers'
import { Purchases } from './pages/Purchases'
import { Sales } from './pages/Sales'
import { Stocks } from './pages/Stocks'
import { Transfers } from './pages/Transfers'
import { CashSessions } from './pages/CashSessions'
import { PointDeVente } from './pages/PointDeVente'
import { AuditLogs } from './pages/AuditLogs'
import { Reports } from './pages/Reports'
import { Home } from './pages/Home'
import { Register } from './pages/Register'
import { BackOffice } from './pages/BackOffice'
import { Settings } from './pages/Settings'
import { Branches } from './pages/Branches'
import { UsersManagement } from './pages/UsersManagement'
import { UserGuide } from './pages/UserGuide'
import { AnimatedBubbles } from './components/AnimatedBubbles'
import logo from './assets/logo.jpg'
import { BranchSelectionPage } from './pages/BranchSelectionPage'

function MainContent() {
  const { user, activeBranch } = useApp()
  const [activeTab, setActiveTab] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef = useRef(null)

  useEffect(() => {
    if (user) {
      const role = user.role?.slug || user.role?.name || user.role
      const isSuperAdmin = role === 'super-admin'
      const forbiddenTabs = ['catalog','suppliers','customers','purchases','stocks','transfers','cash-sessions','sales','pos','reports','settings','branches','users-mgmt']
      if (isSuperAdmin && forbiddenTabs.includes(activeTab)) setActiveTab('backoffice')
    }
  }, [user, activeTab])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && drawerRef.current && !drawerRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navigate = (tab) => { setActiveTab(tab); setMenuOpen(false) }

  const role = user?.role?.slug || user?.role?.name || user?.role
  const isSuperAdmin = role === 'super-admin'
  const isAdminOrGerant = role === 'admin' || role === 'gerant'
  const isAdmin = role === 'admin' || isSuperAdmin

  const renderContent = () => {
    if (user && isAdmin && !activeBranch && activeTab !== 'select-branch' && !isSuperAdmin) {
      return <BranchSelectionPage onSelectBranch={() => navigate('home')} />
    }

    switch (activeTab) {
      case 'home':          return <Home setActiveTab={setActiveTab} />
      case 'register':      return <Register setActiveTab={setActiveTab} />
      case 'auth':          return <Login setActiveTab={setActiveTab} />
      case 'select-branch': return <BranchSelectionPage onSelectBranch={() => navigate('home')} />
      case 'catalog':       return <Catalog />
      case 'suppliers':     return <Suppliers />
      case 'customers':     return <Customers />
      case 'purchases':     return <Purchases />
      case 'stocks':        return <Stocks />
      case 'transfers':     return <Transfers />
      case 'cash-sessions': return <CashSessions />
      case 'sales':         return <Sales />
      case 'pos':           return <PointDeVente />
      case 'audit':         return <AuditLogs />
      case 'reports':       return <Reports />
      case 'backoffice':    return <BackOffice />
      case 'settings':      return <Settings />
      case 'branches':      return <Branches />
      case 'users-mgmt':    return <UsersManagement />
      case 'userguide':     return <UserGuide />
      default:              return <Home setActiveTab={setActiveTab} />
    }
  }

  const navLinks = [
    { tab: 'home',          icon: 'fa-house',           label: 'Accueil',       show: true },
    { tab: 'auth',          icon: user ? 'fa-user' : 'fa-key', label: user ? 'Mon Profil' : 'Connexion', show: true },
    { tab: 'register',      icon: 'fa-pen-to-square',   label: "S'inscrire",    show: !user },
    { tab: 'catalog',       icon: 'fa-box',             label: 'Catalogue',     show: !!(user && !isSuperAdmin) },
    { tab: 'suppliers',     icon: 'fa-handshake',       label: 'Fournisseurs',  show: !!(user && !isSuperAdmin) },
    { tab: 'customers',     icon: 'fa-users',           label: 'Clients',       show: !!(user && !isSuperAdmin) },
    { tab: 'purchases',     icon: 'fa-truck-ramp-box',  label: 'Achats',        show: !!(user && !isSuperAdmin) },
    { tab: 'stocks',        icon: 'fa-layer-group',     label: 'Stocks',        show: !!(user && !isSuperAdmin) },
    { tab: 'transfers',     icon: 'fa-right-left',      label: 'Transferts',    show: !!(user && !isSuperAdmin) },
    { tab: 'cash-sessions', icon: 'fa-money-bill-wave', label: 'Caisses',       show: !!(user && !isSuperAdmin) },
    { tab: 'sales',         icon: 'fa-receipt',         label: 'Ventes',        show: !!(user && !isSuperAdmin) },
    { tab: 'pos',           icon: 'fa-cash-register',   label: 'POS',           show: !!(user && !isSuperAdmin) },
    { tab: 'branches',      icon: 'fa-store',           label: 'Boutiques',     show: !!(user && !isSuperAdmin && (role === 'admin' || role === 'gerant')) },
    { tab: 'users-mgmt',    icon: 'fa-users-gear',      label: 'Personnel',     show: !!(user && !isSuperAdmin && (role === 'admin' || role === 'gerant')) },
    { tab: 'audit',         icon: 'fa-shield-halved',   label: 'Audit',         show: !!(user && (isSuperAdmin || isAdminOrGerant)) },
    { tab: 'reports',       icon: 'fa-chart-line',      label: 'Rapports',      show: !!(user && isAdminOrGerant) },
    { tab: 'backoffice',    icon: 'fa-gears',           label: 'Back-office',   show: !!(user && isSuperAdmin) },
    { tab: 'settings',      icon: 'fa-sliders',         label: 'Paramètres',    show: !!(user && isAdminOrGerant) },
    { tab: 'userguide',     icon: 'fa-book-open',       label: 'Aide & Guide',  show: !!user },
  ].filter(l => l.show)

  return (
    <>
      {/* ── NAVBAR ── */}
      <header className="app-main-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="burger-btn" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
            <span></span><span></span><span></span>
          </button>
          <div className="navbar-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Logo" className="navbar-logo-img" />
            <span>
              <span className="logo-text-apex">Apex</span>
              <span className="logo-text-pos">POS</span>
            </span>
          </div>

          {/* BADGE DE BOUTIQUE ACTIVE / SÉLECTEUR */}
          {user && !isSuperAdmin && (
            isAdmin ? (
              <button 
                className="navbar-branch-pill-btn" 
                onClick={() => navigate('select-branch')}
                title="Changer d'espace de travail / boutique active"
              >
                <i className="fa-solid fa-store text-primary"></i>
                <span className="branch-pill-name">{activeBranch?.name || 'Sélectionner une boutique'}</span>
                <i className="fa-solid fa-chevron-down ms-1 text-muted" style={{ fontSize: '10px' }}></i>
              </button>
            ) : (
              <div className="navbar-branch-badge-readonly">
                <i className="fa-solid fa-shop text-success me-1"></i>
                <span>{activeBranch?.name || user?.branch?.name || 'Ma Boutique'}</span>
              </div>
            )
          )}
        </div>
        <div className="navbar-links">
          {navLinks.map(({ tab, icon, label }) => (
            <button key={tab} className={`navbar-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => navigate(tab)}>
              <i className={`fa-solid ${icon} me-1`}></i> {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── OVERLAY ── */}
      <div className={`drawer-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* ── DRAWER GAUCHE ── */}
      <nav ref={drawerRef} className={`side-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-logo">
            <img src={logo} alt="Logo" className="navbar-logo-img" />
            <span><span className="logo-text-apex">Apex</span><span className="logo-text-pos">POS</span></span>
          </div>
          <button className="drawer-close-btn" onClick={() => setMenuOpen(false)} aria-label="Fermer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="drawer-links">
          {navLinks.map(({ tab, icon, label }) => (
            <button key={tab} className={`drawer-link-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => navigate(tab)}>
              <i className={`fa-solid ${icon}`}></i>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {user && (
          <div className="drawer-footer">
            <div className="drawer-user-info">
              <i className="fa-solid fa-circle-user" style={{ fontSize: '28px', color: 'var(--color-primary)' }}></i>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{user.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {renderContent()}
      <AnimatedBubbles />

      <style>{`
        .app-main-navbar {
          position: fixed; top: 0; left: 0; right: 0;
          min-height: 64px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--box-shadow);
          backdrop-filter: var(--backdrop-blur);
          z-index: 500;
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 40px; gap: 16px;
          transition: all var(--transition-normal);
        }

        /* BURGER */
        .burger-btn {
          display: none;
          flex-direction: column; justify-content: center; align-items: center; gap: 5px;
          width: 40px; height: 40px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          cursor: pointer; padding: 8px;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        .burger-btn:hover { background: var(--color-primary); border-color: var(--color-primary); }
        .burger-btn:hover span { background: #fff; }
        .burger-btn span {
          display: block; width: 20px; height: 2px;
          background: var(--text-main); border-radius: 2px;
          transition: all var(--transition-fast);
        }

        /* OVERLAY */
        .drawer-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(3px);
          z-index: 900; opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .drawer-overlay.open { opacity: 1; pointer-events: all; }

        /* DRAWER */
        .side-drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 280px; max-width: 85vw;
          background: var(--bg-card);
          border-right: 1px solid var(--border-color);
          box-shadow: 6px 0 40px rgba(0,0,0,0.25);
          z-index: 1000;
          display: flex; flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .side-drawer.open { transform: translateX(0); }

        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-input);
          flex-shrink: 0;
        }
        .drawer-logo {
          font-family: var(--font-title); font-weight: 800; font-size: 18px;
          display: flex; align-items: center; gap: 10px;
        }
        .drawer-close-btn {
          width: 34px; height: 34px; border-radius: 50%;
          background: var(--bg-card); border: 1px solid var(--border-color);
          color: var(--text-main); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: all var(--transition-fast); flex-shrink: 0;
        }
        .drawer-close-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .drawer-links {
          flex: 1; overflow-y: auto;
          padding: 12px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .drawer-links::-webkit-scrollbar { width: 4px; }
        .drawer-links::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }

        .drawer-link-btn {
          display: flex; align-items: center; gap: 14px;
          width: 100%; padding: 12px 16px;
          border-radius: 12px; background: transparent; border: none;
          color: var(--text-muted);
          font-family: var(--font-title); font-weight: 600; font-size: 14px;
          cursor: pointer; text-align: left;
          transition: all var(--transition-fast);
        }
        .drawer-link-btn i { width: 20px; text-align: center; font-size: 15px; flex-shrink: 0; }
        .drawer-link-btn:hover { background: var(--bg-input); color: var(--text-main); transform: translateX(4px); }
        .drawer-link-btn.active {
          background: linear-gradient(135deg, var(--color-primary), #10b981);
          color: #fff;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }

        .drawer-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
          background: var(--bg-input); flex-shrink: 0;
        }
        .drawer-user-info { display: flex; align-items: center; gap: 12px; }

        /* LOGO */
        .navbar-logo {
          font-family: var(--font-title); font-weight: 800; font-size: 22px;
          display: flex; align-items: center; gap: 12px;
          user-select: none; transition: transform var(--transition-fast) ease;
        }
        .navbar-logo:hover { transform: scale(1.02); }
        .navbar-logo-img {
          width: 38px; height: 38px; border-radius: 50%; object-fit: cover;
          border: 2px solid var(--color-primary);
          box-shadow: 0 0 10px rgba(59,130,246,0.2);
          transition: all var(--transition-normal);
        }
        .navbar-logo:hover .navbar-logo-img { box-shadow: 0 0 15px var(--color-primary); transform: rotate(5deg); }
        .logo-text-apex {
          background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900;
        }
        .logo-text-pos {
          color: var(--text-main); font-weight: 600; font-size: 18px;
          background: rgba(59,130,246,0.1); padding: 2px 8px; border-radius: 6px;
          margin-left: 2px; border: 1px solid rgba(59,130,246,0.2);
        }

        /* DESKTOP NAV */
        .navbar-links { display: flex; gap: 8px; flex-wrap: wrap; }
        .navbar-tab-btn {
          background: transparent; border: none; color: var(--text-muted);
          font-family: var(--font-title); font-weight: 600; font-size: 13px;
          padding: 6px 12px; cursor: pointer;
          border-radius: var(--border-radius-sm);
          transition: all var(--transition-fast); white-space: nowrap;
        }
        .navbar-tab-btn:hover { color: var(--text-main); background: var(--bg-input); }
        .navbar-tab-btn.active { color: #fff; background: var(--color-primary); }

        /* BRANCH SELECTOR PILL */
        .navbar-branch-pill-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.25);
          color: var(--text-main);
          padding: 5px 12px; border-radius: 20px;
          font-family: var(--font-title); font-weight: 600; font-size: 13px;
          cursor: pointer; transition: all var(--transition-fast);
          margin-left: 10px;
        }
        .navbar-branch-pill-btn:hover {
          background: rgba(59,130,246,0.18);
          border-color: var(--color-primary);
          transform: translateY(-1px);
        }
        .branch-pill-name {
          max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .navbar-branch-badge-readonly {
          display: flex; align-items: center; gap: 6px;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.25);
          color: var(--text-main);
          padding: 4px 10px; border-radius: 20px;
          font-family: var(--font-title); font-weight: 600; font-size: 12px;
          margin-left: 10px;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .app-main-navbar { padding: 10px 16px; min-height: 58px; }
          .burger-btn { display: flex; }
          .navbar-links { display: none; }
          .navbar-logo { font-size: 18px; }
          .navbar-logo-img { width: 32px; height: 32px; }
          .logo-text-pos { font-size: 15px; }
        }
      `}</style>
    </>
  )
}

function App() {
  return (
    <AppProvider>
      <ThemeSelector />
      <MainContent />
    </AppProvider>
  )
}

export default App
