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
import { Notifications } from './pages/Notifications'
import { NotificationBell } from './components/NotificationBell'
import { AnimatedBubbles } from './components/AnimatedBubbles'
import logo from './assets/logo.jpg'
import { BranchSelectionPage } from './pages/BranchSelectionPage'
import { Dashboard } from './pages/Dashboard'

function MainContent() {
  const { user, activeBranch, assignedBranches } = useApp()
  const [activeTab, setActiveTab] = useState(() => {
    if (!user) return 'home'
    const role = user.role?.slug || user.role?.name || user.role
    if (role === 'super-admin') return 'backoffice'
    return 'dashboard'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef = useRef(null)
  const [tabHistory, setTabHistory] = useState([])

  const navigate = (newTab) => {
    if (newTab !== activeTab) {
      setTabHistory(prev => [...prev, activeTab])
      setActiveTab(newTab)
    }
    setMenuOpen(false)
  }

  const goBack = () => {
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1]
      setTabHistory(prev => prev.slice(0, -1))
      setActiveTab(prevTab)
    }
    setMenuOpen(false)
  }

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

  // Note : Tous les utilisateurs connectés conservent l'accès aux modules opérationnels (POS, Catalogue, Stocks, etc.)
  const role = user?.role?.slug || user?.role?.name || user?.role
  const isSuperAdmin = role === 'super-admin' || user?.email === 'superadmin@dls.com'
  const isAdminOrGerant = role === 'admin' || role === 'gerant' || isSuperAdmin
  const isAdmin = role === 'admin' || isSuperAdmin

  const renderContent = () => {
    // Si l'utilisateur n'est pas connecté
    if (!user) {
      switch (activeTab) {
        case 'register': return <Register setActiveTab={setActiveTab} />
        case 'auth':     return <Login setActiveTab={setActiveTab} />
        case 'home':
        default:         return <Home setActiveTab={setActiveTab} />
      }
    }

    // Si l'utilisateur est connecté mais doit choisir sa boutique (uniquement pour les utilisateurs non Super-Admin)
    if (!activeBranch && activeTab !== 'select-branch' && !isSuperAdmin && (assignedBranches?.length > 1 || isAdmin || role === 'gerant')) {
      return <BranchSelectionPage onSelectBranch={() => navigate('dashboard')} />
    }

    // Utilisateur connecté : Rendu des pages selon le profil
    switch (activeTab) {
      case 'home':          return <Home setActiveTab={setActiveTab} />
      case 'backoffice':    return <BackOffice />
      case 'dashboard':     return isSuperAdmin ? <BackOffice /> : <Dashboard setActiveTab={setActiveTab} />
      case 'register':      return <Register setActiveTab={setActiveTab} />
      case 'auth':          return <Login setActiveTab={setActiveTab} />
      case 'select-branch': return <BranchSelectionPage onSelectBranch={() => navigate('dashboard')} />
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
      case 'settings':      return <Settings />
      case 'branches':      return <Branches />
      case 'users-mgmt':    return <UsersManagement />
      case 'userguide':     return <UserGuide />
      case 'notifications': return <Notifications setActiveTab={setActiveTab} />
      default:              return isSuperAdmin ? <BackOffice /> : <Dashboard setActiveTab={setActiveTab} />
    }
  }

  // Structure des menus avec séparation étanche entre Super-Admin SaaS et Utilisateurs de Boutiques
  const navLinks = [
    { tab: 'home',          icon: 'fa-house',           label: 'Accueil',       show: true },
    { tab: 'backoffice',    icon: 'fa-gears',           label: 'Console SaaS',  show: !!(user && isSuperAdmin) },
    { tab: 'dashboard',     icon: 'fa-gauge-high',      label: 'Dashboard',     show: !!(user && !isSuperAdmin) },
    { tab: 'pos',           icon: 'fa-cash-register',   label: 'POS (Caisse)',  show: !!(user && !isSuperAdmin) },
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
    { tab: 'branches',      icon: 'fa-store',           label: 'Boutiques',     show: !!(user && !isSuperAdmin && (role === 'admin' || role === 'gerant')) },
    { tab: 'users-mgmt',    icon: 'fa-users-gear',      label: 'Personnel',     show: !!(user && !isSuperAdmin && (role === 'admin' || role === 'gerant')) },
    { tab: 'audit',         icon: 'fa-shield-halved',   label: 'Audit',         show: !!user },
    { tab: 'reports',       icon: 'fa-chart-line',      label: 'Rapports',      show: !!(user && !isSuperAdmin && isAdminOrGerant) },
    { tab: 'notifications', icon: 'fa-bell',            label: 'Notifications', show: !!user },
    { tab: 'settings',      icon: 'fa-sliders',         label: 'Paramètres',    show: !!(user && !isSuperAdmin && isAdminOrGerant) },
    { tab: 'userguide',     icon: 'fa-book-open',       label: 'Aide & Guide',  show: !!user },
  ].filter(l => l.show)

  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* ── NAVBAR ── */}
      <header className="app-main-navbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '64px', minHeight: '64px', maxHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexWrap: 'nowrap', overflow: 'visible', zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button className="burger-btn" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
            <span></span><span></span><span></span>
          </button>
          {tabHistory.length > 0 && (
            <button 
              className="navbar-goback-btn" 
              onClick={goBack} 
              title="Retour à la page précédente"
              style={{
                background: 'var(--bg-input, rgba(255,255,255,0.08))',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '4px 9px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-arrow-left text-primary"></i>
              <span>Retour</span>
            </button>
          )}

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

          {/* ── TRACK CENTRAL COMPLET (RECHERCHE + PANIER GLISSANT 100% LARGEUR + BADGES) ── */}
          <div className="navbar-cart-track d-none d-lg-flex" title="Barre d'action globale & Caisse Tactile ApexPOS">
            {/* Recherche Rapide à gauche du track */}
            <div className="d-flex align-items-center gap-2" style={{ zIndex: 2 }}>
              <i className="fa-solid fa-magnifying-glass text-primary" style={{ fontSize: '13px' }}></i>
              <input 
                type="text" 
                placeholder="Rechercher produit, vente, client..." 
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  color: 'var(--text-main)',
                  width: '190px',
                  fontWeight: 500
                }}
                onFocus={() => navigate('catalog')}
              />
            </div>

            {/* Le Panier animé qui va et vient sur toute la largeur intermédiaire */}
            <div className="navbar-cart-animated" onClick={() => navigate('pos')} style={{ cursor: 'pointer' }}>
              <i className="fa-solid fa-cart-shopping navbar-cart-icon"></i>
              <span className="navbar-cart-text">ApexPOS en Direct 🛒</span>
            </div>

            {/* Badges de statut à droite du track */}
            <div className="d-none d-xl-flex align-items-center gap-2 ms-auto" style={{ zIndex: 2 }}>
              <span className="badge bg-success-subtle text-success" style={{ fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '12px' }}>
                <i className="fa-solid fa-signal me-1"></i> Système Synchro
              </span>
            </div>
          </div>
        </div>

        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'nowrap', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '45vw', padding: '2px 0', flexShrink: 1 }}>
          {navLinks.map(({ tab, icon, label }) => (
            <button 
              key={tab} 
              className={`navbar-tab-btn ${activeTab === tab ? 'active' : ''}`} 
              style={{ whiteSpace: 'nowrap', flexShrink: 0, fontSize: '12px', padding: '5px 9px', display: 'inline-flex', alignItems: 'center' }}
              onClick={() => navigate(tab)}
            >
              <i className={`fa-solid ${icon} me-1`}></i> {label}
            </button>
          ))}
        </div>

        <div className="navbar-right-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* HORLOGE EN DIRECT & DATE */}
          <div className="navbar-clock-widget d-none d-lg-flex align-items-center me-1" style={{ fontSize: '12px', color: 'var(--text-muted, #6b7280)', gap: '5px', fontWeight: 600 }}>
            <i className="fa-solid fa-clock text-primary"></i>
            <span>{currentTime}</span>
          </div>

          {/* RACCOURCI POS CASSE RAPIDE */}
          {user && !isSuperAdmin && (
            <button 
              className="btn btn-primary btn-sm d-none d-md-inline-flex align-items-center" 
              onClick={() => navigate('pos')}
              style={{ fontWeight: 700, padding: '5px 12px', fontSize: '12px', borderRadius: '8px', whiteSpace: 'nowrap' }}
            >
              <i className="fa-solid fa-cash-register me-1"></i> Caisse POS
            </button>
          )}

          {/* BADGE / BOUTON PROFIL ET DÉCONNEXION */}
          {user && (
            <button 
              className="navbar-user-profile-btn" 
              onClick={() => navigate('auth')}
              title={`Connecté en tant que ${user.name} (${user.email})`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '4px 10px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input, rgba(255,255,255,0.08))',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--primary-color, #2563eb)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '11px'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="d-none d-sm-inline" style={{ fontWeight: 600, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </span>
            </button>
          )}

          <NotificationBell onNavigate={navigate} />
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
          {tabHistory.length > 0 && (
            <button 
              className="drawer-link-btn" 
              onClick={goBack} 
              style={{ 
                borderBottom: '1px dashed var(--border-color)', 
                marginBottom: '8px', 
                color: 'var(--primary-color)', 
                fontWeight: 700 
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Retour (Page précédente)</span>
            </button>
          )}
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

      {/* ── CONTENU PRINCIPAL SANS CHEVAUCHEMENT ── */}
      <main className="app-main-content" style={{ paddingTop: '84px', minHeight: 'calc(100vh - 84px)', width: '100%', boxSizing: 'border-box' }}>
        {renderContent()}
      </main>
      <AnimatedBubbles />

      <style>{`
        .app-main-navbar {
          position: fixed; top: 0; left: 0; right: 0;
          height: 64px; min-height: 64px; max-height: 64px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; gap: 16px; flex-wrap: nowrap; overflow: hidden;
          transition: all var(--transition-normal);
        }

        .app-main-content {
          padding-top: 74px;
          min-height: calc(100vh - 74px);
          width: 100%;
          box-sizing: border-box;
        }

        /* BURGER */
        .burger-btn {
          display: none;
          flex-direction: column; justify-content: center; align-items: center; gap: 5px;
          width: 38px; height: 38px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          cursor: pointer; padding: 6px;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        .burger-btn:hover { background: var(--color-primary); border-color: var(--color-primary); }
        .burger-btn:hover span { background: #fff; }
        .burger-btn span {
          display: block; width: 18px; height: 2px;
          background: var(--text-main); border-radius: 2px;
          transition: all var(--transition-fast);
        }

        /* OVERLAY */
        .drawer-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(3px);
          z-index: 1050; opacity: 0; pointer-events: none;
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
          z-index: 1100;
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
          font-family: var(--font-title); font-weight: 800; font-size: 20px;
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
          user-select: none; transition: transform var(--transition-fast) ease;
        }
        .navbar-logo:hover { transform: scale(1.02); }
        .navbar-logo-img {
          width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
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
          color: var(--text-main); font-weight: 600; font-size: 16px;
          background: rgba(59,130,246,0.1); padding: 2px 6px; border-radius: 6px;
          margin-left: 2px; border: 1px solid rgba(59,130,246,0.2);
        }

        /* DESKTOP NAV - STRICTLY 1 ROW */
        .navbar-links {
          display: flex; align-items: center; gap: 4px;
          flex-wrap: nowrap; overflow-x: auto; white-space: nowrap;
          scrollbar-width: none; -ms-overflow-style: none;
          max-width: 52vw; padding: 4px 0; flex-shrink: 1;
        }
        .navbar-links::-webkit-scrollbar { display: none; }

        .navbar-tab-btn {
          background: transparent; border: none; color: var(--text-muted);
          font-family: var(--font-title); font-weight: 600; font-size: 12px;
          padding: 5px 10px; cursor: pointer; flex-shrink: 0; white-space: nowrap;
          border-radius: var(--border-radius-sm);
          transition: all var(--transition-fast); display: flex; align-items: center;
        }
        .navbar-tab-btn:hover { color: var(--text-main); background: var(--bg-input); }
        .navbar-tab-btn.active { color: #fff; background: var(--color-primary); }

        /* BRANCH SELECTOR PILL */
        .navbar-branch-pill-btn {
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.25);
          color: var(--text-main);
          padding: 4px 10px; border-radius: 20px;
          font-family: var(--font-title); font-weight: 600; font-size: 12px;
          cursor: pointer; transition: all var(--transition-fast);
        }
        .navbar-branch-pill-btn:hover {
          background: rgba(59,130,246,0.18);
          border-color: var(--color-primary);
          transform: translateY(-1px);
        }
        .branch-pill-name {
          max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .navbar-branch-badge-readonly {
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.25);
          color: var(--text-main);
          padding: 4px 10px; border-radius: 20px;
          font-family: var(--font-title); font-weight: 600; font-size: 12px;
        }

        @media (max-width: 1400px) {
          .burger-btn { display: flex !important; }
          .navbar-links { display: none !important; }
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
