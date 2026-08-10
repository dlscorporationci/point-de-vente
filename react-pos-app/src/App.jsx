import React, { useState, useEffect, useRef } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { getAssetUrl } from './utils/urlHelper'
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
import { AccessControlAuditPage } from './pages/AccessControlAuditPage'
import { Reports } from './pages/Reports'
import { Home } from './pages/Home'
import { Register } from './pages/Register'
import { BackOffice } from './pages/BackOffice'
import { Settings } from './pages/Settings'
import { Branches } from './pages/Branches'
import { UsersManagement } from './pages/UsersManagement'
import { UserGuide } from './pages/UserGuide'
import { Notifications } from './pages/Notifications'
import { SyncCenter } from './pages/SyncCenter'
import { NotificationBell } from './components/NotificationBell'
import { NetworkStatusBadge } from './components/NetworkStatusBadge'
import { InstallPWAButton } from './components/InstallPWAButton'
import { AnimatedBubbles } from './components/AnimatedBubbles'
import logo from './assets/logo.jpg'
import { BranchSelectionPage } from './pages/BranchSelectionPage'
import { SessionLockScreen } from './components/SessionLockScreen'
import { Dashboard } from './pages/Dashboard'
import { DocumentCenter } from './pages/DocumentCenter'
import { CommunicationCenter } from './pages/CommunicationCenter'
import { MaintenanceCenter } from './pages/MaintenanceCenter'
import { MaintenanceScreen } from './components/MaintenanceScreen'

const getRoleSlug = (r) => {
  if (!r) return '';
  if (typeof r === 'string') return r;
  if (typeof r === 'object') return r.slug || r.name || '';
  return String(r);
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary a intercepté une erreur :", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', background: '#fee2e2', color: '#991b1b', fontFamily: 'sans-serif', margin: '20px', borderRadius: '12px', border: '1px solid #f87171' }}>
          <h2 style={{ margin: '0 0 10px' }}>⚠️ Erreur d'affichage applicative (React Error)</h2>
          <p><strong>Détails :</strong> {this.state.error?.toString()}</p>
          <pre style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', color: '#1e293b' }}>
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainContent() {
  const { user, token, activeBranch, assignedBranches, maintenanceInfo } = useApp()
  
  const role = getRoleSlug(user?.role);
  const isSuperAdmin = role === 'super-admin' || role === 'Super Admin' || role === 'superadmin' || user?.email === 'superadmin@dls.com' || !!user?.is_superadmin;
  const isAdminOrGerant = role === 'admin' || isSuperAdmin;
  const isAdmin = role === 'admin' || isSuperAdmin;

  const [activeTab, setActiveTabState] = useState(() => {
    if (!user) return 'home';
    const savedTab = sessionStorage.getItem('apex_active_tab');
    if (savedTab && savedTab !== 'home' && savedTab !== 'auth') return savedTab;
    if (isSuperAdmin) return 'backoffice';
    return 'dashboard';
  });

  const setActiveTab = (tab) => {
    sessionStorage.setItem('apex_active_tab', tab);
    setActiveTabState(tab);
  };

  // Synchronisation automatique : lorsqu'un utilisateur se connecte, le diriger immédiatement sur le Dashboard
  useEffect(() => {
    if (user) {
      const savedTab = sessionStorage.getItem('apex_active_tab');
      if (!savedTab || savedTab === 'home' || savedTab === 'auth') {
        const target = isSuperAdmin ? 'backoffice' : 'dashboard';
        sessionStorage.setItem('apex_active_tab', target);
        setActiveTabState(target);
      }
    }
  }, [user, isSuperAdmin]);

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

  const getCompanyLogoUrl = (logoPath) => {
    if (!logoPath) return logo;
    return getAssetUrl(logoPath);
  };

  // ── Mise à jour dynamique du titre de l'onglet et du favicon selon l'entreprise connectée ──
  useEffect(() => {
    const companyName = user?.company?.name;
    const slogan = user?.company?.slogan;
    const faviconPath = user?.company?.favicon_path;
    const logoPath = user?.company?.logo_path;

    // Titre de l'onglet
    if (companyName) {
      document.title = slogan
        ? `${companyName} — ${slogan}`
        : `${companyName} — DLS POS`;
    } else {
      document.title = 'DLS POS — Gestion Commerciale';
    }

    // Favicon dynamique : favicon personnalisé > logo entreprise > favicon par défaut
    const faviconUrl = faviconPath
      ? getAssetUrl(faviconPath)
      : (logoPath ? getAssetUrl(logoPath) : null);

    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [user?.company?.name, user?.company?.slogan, user?.company?.favicon_path, user?.company?.logo_path]);

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

  // Partie 6 : Détection du survol de l'extrême bord gauche (x <= 10px) pour ouvrir la sidebar
  useEffect(() => {
    let hoverTimer;
    const handleMouseMove = (e) => {
      if (window.innerWidth <= 768) return; // Sur mobile/tactile, conserver le bouton tactile
      if (e.clientX <= 10) {
        if (!hoverTimer) {
          hoverTimer = setTimeout(() => {
            setMenuOpen(true);
          }, 150);
        }
      } else if (e.clientX > 300) {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hoverTimer) clearTimeout(hoverTimer);
    };
  }, []);

  // Partie 7 : Verrouillage automatique de session par inactivité (5 minutes)
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const { logout } = useApp();

  useEffect(() => {
    if (!user) return;
    let idleTimer;
    const IDLE_TIMEOUT = 5 * 60 * 1000;

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsSessionLocked(true);
      }, IDLE_TIMEOUT);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetIdleTimer));
    resetIdleTimer();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      events.forEach(evt => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [user]);

  // État des accordéons de la navigation latérale (ouvert/fermé)
  const [openNavGroups, setOpenNavGroups] = useState({
    sales_catalog: true,
    stock_logistics: false,
    administration: false,
    system_support: false
  });

  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    }, 10000)
    return () => clearInterval(timer)
  }, []);

  const renderContent = () => {
    // Si l'utilisateur n'est pas connecté
    if (!user) {
      switch (activeTab) {
        case 'register': return <Register setActiveTab={setActiveTab} />
        case 'home':     return <Home setActiveTab={setActiveTab} />
        case 'auth':
        default:         return <Login setActiveTab={setActiveTab} />
      }
    }

    // Si l'utilisateur est connecté mais doit choisir sa boutique (uniquement pour les utilisateurs non Super-Admin)
    if (!activeBranch && activeTab !== 'select-branch' && !isSuperAdmin && (assignedBranches?.length > 1 || !user?.branch_id)) {
      return <BranchSelectionPage onSelectBranch={() => navigate('dashboard')} />
    }

    // Controler la permission par Zone d'Accès
    const allowedModules = user?.access_zone?.allowed_modules;
    const isModulePermitted = (tabKey) => {
      if (isSuperAdmin || role === 'admin') return true;
      if (!allowedModules || !Array.isArray(allowedModules) || allowedModules.length === 0) return true;
      const alwaysAllowed = ['home', 'dashboard', 'auth', 'userguide', 'notifications', 'sync-center', 'select-branch'];
      if (alwaysAllowed.includes(tabKey)) return true;
      if (allowedModules.includes(tabKey)) return true;
      // Compatibilité des alias étendus
      if (tabKey === 'stocks' && allowedModules.includes('catalog')) return true;
      if (tabKey === 'catalog' && allowedModules.includes('stocks')) return true;
      if (['sales', 'cash-sessions'].includes(tabKey) && allowedModules.includes('pos')) return true;
      if (tabKey === 'pos' && (allowedModules.includes('sales') || allowedModules.includes('cash-sessions'))) return true;
      if (tabKey === 'suppliers' && allowedModules.includes('purchases')) return true;
      if (tabKey === 'purchases' && allowedModules.includes('suppliers')) return true;
      if (tabKey === 'customers' && (allowedModules.includes('pos') || allowedModules.includes('sales'))) return true;
      return false;
    };

    // Bloquer l'affichage si le module est restreint par la zone d'accès
    if (!isModulePermitted(activeTab)) {
      return (
        <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card p-5 shadow-lg border-danger" style={{ maxWidth: '520px', borderRadius: '16px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🚫</div>
            <h3 className="fw-bold text-danger mb-2">Accès Restreint</h3>
            <p className="text-muted mb-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>
              Votre zone d'accès actuelle (<strong>{user?.access_zone?.name || "Zone Restreinte"}</strong>) ne vous autorise pas à accéder au module <strong>{activeTab.toUpperCase()}</strong>.
            </p>
            <button onClick={() => navigate('dashboard')} className="btn btn-primary fw-bold py-2 px-4">
              Retour au Dashboard
            </button>
          </div>
        </div>
      );
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
      case 'audit':         return <AccessControlAuditPage />
      case 'reports':       return <Reports />
      case 'documents':     return <DocumentCenter />
      case 'communication': return <CommunicationCenter />
      case 'maintenance':   return <MaintenanceCenter />
      case 'settings':      return <Settings />
      case 'branches':      return <Branches />
      case 'users-mgmt':    return <UsersManagement />
      case 'userguide':     return <UserGuide />
      case 'sync-center':   return <SyncCenter />
      case 'notifications': return <Notifications setActiveTab={setActiveTab} />
      default:              return isSuperAdmin ? <BackOffice /> : <Dashboard setActiveTab={setActiveTab} />
    }
  }

  // Carte des liens de navigation avec contrôle des permissions d'accès et zones d'accès
  const allowedModulesList = user?.access_zone?.allowed_modules;
  const canAccessModule = (tabKey) => {
    if (isSuperAdmin || role === 'admin') return true;
    if (!allowedModulesList || !Array.isArray(allowedModulesList) || allowedModulesList.length === 0) return true;
    const alwaysAllowed = ['home', 'dashboard', 'auth', 'userguide', 'notifications', 'sync-center', 'select-branch'];
    if (alwaysAllowed.includes(tabKey)) return true;
    if (allowedModulesList.includes(tabKey)) return true;
    // Compatibilité des alias étendus
    if (tabKey === 'stocks' && allowedModulesList.includes('catalog')) return true;
    if (tabKey === 'catalog' && allowedModulesList.includes('stocks')) return true;
    if (['sales', 'cash-sessions'].includes(tabKey) && allowedModulesList.includes('pos')) return true;
    if (tabKey === 'pos' && (allowedModulesList.includes('sales') || allowedModulesList.includes('cash-sessions'))) return true;
    if (tabKey === 'suppliers' && allowedModulesList.includes('purchases')) return true;
    if (tabKey === 'purchases' && allowedModulesList.includes('suppliers')) return true;
    if (tabKey === 'customers' && (allowedModulesList.includes('pos') || allowedModulesList.includes('sales'))) return true;
    return false;
  };

  const navLinksMap = {
    home:          { icon: 'fa-house',           label: 'Accueil',       show: true },
    backoffice:    { icon: 'fa-gears',           label: 'Console SaaS',  show: !!(user && isSuperAdmin) },
    dashboard:     { icon: 'fa-gauge-high',      label: 'Dashboard',     show: !!(user && !isSuperAdmin) },
    pos:           { icon: 'fa-cash-register',   label: 'POS (Caisse)',  show: !!(user && !isSuperAdmin && canAccessModule('pos')) },
    catalog:       { icon: 'fa-box',             label: 'Catalogue',     show: !!(user && !isSuperAdmin && canAccessModule('catalog')) },
    customers:     { icon: 'fa-users',           label: 'Clients',       show: !!(user && !isSuperAdmin && canAccessModule('customers')) },
    suppliers:     { icon: 'fa-handshake',       label: 'Fournisseurs',  show: !!(user && !isSuperAdmin && canAccessModule('suppliers')) },
    sales:         { icon: 'fa-receipt',         label: 'Ventes',        show: !!(user && !isSuperAdmin && canAccessModule('sales')) },
    'cash-sessions': { icon: 'fa-money-bill-wave', label: 'Caisses',       show: !!(user && !isSuperAdmin && canAccessModule('cash-sessions')) },
    purchases:     { icon: 'fa-truck-ramp-box',  label: 'Achats & Appro', show: !!(user && !isSuperAdmin && canAccessModule('purchases')) },
    stocks:        { icon: 'fa-layer-group',     label: 'Stocks',        show: !!(user && !isSuperAdmin && canAccessModule('stocks')) },
    transfers:     { icon: 'fa-right-left',      label: 'Transferts',    show: !!(user && !isSuperAdmin && canAccessModule('transfers')) },
    branches:      { icon: 'fa-store',           label: 'Boutiques',     show: !!(user && !isSuperAdmin && canAccessModule('branches')) },
    'users-mgmt':  { icon: 'fa-users-gear',      label: 'Personnel & Rôles', show: !!(user && !isSuperAdmin && canAccessModule('users-mgmt')) },
    settings:      { icon: 'fa-sliders',         label: 'Paramètres',    show: !!(user && !isSuperAdmin && canAccessModule('settings')) },
    reports:       { icon: 'fa-chart-line',      label: 'Rapports',      show: !!(user && !isSuperAdmin && canAccessModule('reports')) },
    documents:     { icon: 'fa-folder-open',     label: 'Centre Documents', show: !!user },
    communication: { icon: 'fa-paper-plane',     label: 'Communication SA', show: !!(user && isSuperAdmin) },
    maintenance:   { icon: 'fa-screwdriver-wrench', label: 'Console Maintenance', show: !!(user && isSuperAdmin) },
    audit:         { icon: 'fa-shield-halved',   label: 'Audit & Logs',  show: !!user },
    'sync-center': { icon: 'fa-arrows-rotate',   label: 'Centre Sync',   show: !!user },
    notifications: { icon: 'fa-bell',            label: 'Notifications', show: !!user },
    auth:          { icon: user ? 'fa-user' : 'fa-key', label: user ? 'Mon Profil' : 'Connexion', show: true },
    register:      { icon: 'fa-pen-to-square',   label: "S'inscrire",    show: !user },
    userguide:     { icon: 'fa-book-open',       label: 'Aide & Guide',  show: !!user },
  };

  // Groupes d'onglets pliables (Accordion)
  const navGroups = [
    {
      id: 'main',
      title: '📌 Raccourcis Principaux',
      collapsible: false,
      items: ['home', 'backoffice', 'dashboard', 'pos']
    },
    {
      id: 'sales_catalog',
      title: '📦 Ventes & Catalogue',
      icon: 'fa-cart-shopping',
      collapsible: true,
      items: ['catalog', 'customers', 'suppliers', 'sales', 'cash-sessions']
    },
    {
      id: 'stock_logistics',
      title: '🏬 Stock & Logistique',
      icon: 'fa-boxes-stacked',
      collapsible: true,
      items: ['purchases', 'stocks', 'transfers']
    },
    {
      id: 'administration',
      title: '⚙️ Administration',
      icon: 'fa-user-gear',
      collapsible: true,
      items: ['branches', 'users-mgmt', 'settings', 'reports', 'documents', 'maintenance', 'audit']
    },
    {
      id: 'system_support',
      title: '🔄 Système & Support',
      icon: 'fa-circle-info',
      collapsible: true,
      items: ['sync-center', 'communication', 'notifications', 'auth', 'register', 'userguide']
    }
  ];

  // Déplier automatiquement le groupe contenant l'onglet actif
  useEffect(() => {
    navGroups.forEach(grp => {
      if (grp.collapsible && grp.items.includes(activeTab)) {
        setOpenNavGroups(prev => ({ ...prev, [grp.id]: true }));
      }
    });
  }, [activeTab]);

  const toggleNavGroup = (groupId) => {
    setOpenNavGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Bloquer l'accès à toute l'application en cas de maintenance (Sauf pour le Super-Admin ou pendant la connexion Admin)
  if (maintenanceInfo && !isSuperAdmin && activeTab !== 'auth') {
    return <MaintenanceScreen maintenanceInfo={maintenanceInfo} onAdminLogin={() => setActiveTab('auth')} />;
  }

  // Verrouillage automatique de session par inactivité
  if (isSessionLocked && user) {
    return (
      <SessionLockScreen
        user={user}
        onUnlock={() => setIsSessionLocked(false)}
        onSwitchAccount={() => {
          setIsSessionLocked(false);
          logout();
        }}
      />
    );
  }

  const isAuthenticated = !!(user && (user.id || user.email || user.name));
  const isAppHeaderVisible = isAuthenticated && activeTab !== 'home' && activeTab !== 'auth' && activeTab !== 'register';

  return (
    <>
      {/* ── BANNIÈRE SUPER-ADMIN LORSQUE LE MODE MAINTENANCE EST ACTIF ── */}
      {isSuperAdmin && maintenanceInfo && (
        <div style={{
          position: 'fixed',
          top: isAppHeaderVisible ? '64px' : 0,
          left: 0, right: 0,
          backgroundColor: '#b45309',
          color: '#ffffff',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 700,
          zIndex: 1001,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>
            <strong>MODE MAINTENANCE EN COURS :</strong> Les utilisateurs normaux sont actuellement redirigés vers l'écran de maintenance. Vous conservez l'accès exclusif d'administration.
          </span>
          <button 
            onClick={() => setActiveTab('maintenance')} 
            style={{
              padding: '2px 10px',
              backgroundColor: '#ffffff',
              color: '#b45309',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Gérer
          </button>
        </div>
      )}

      {/* ── BANNIÈRE D'AVERTISSEMENT ABONNEMENT SAAS IMPAYÉ / EXPIRÉ ── */}
      {(() => {
        const expiresAtStr = user?.company?.subscription_expires_at;
        const isCompanySuspended = user?.company?.status === 'suspended' || user?.company?.status === 'inactive';
        const expiresDate = expiresAtStr ? new Date(expiresAtStr) : null;
        const now = new Date();
        const daysLeft = expiresDate ? Math.ceil((expiresDate - now) / (1000 * 60 * 60 * 24)) : null;

        const isSubExpired = expiresDate && expiresDate < now;
        const isSubExpiringSoon = !isSubExpired && daysLeft !== null && daysLeft <= 7;
        const showSubWarning = isAuthenticated && !isSuperAdmin && (isSubExpired || isCompanySuspended || isSubExpiringSoon);

        if (!showSubWarning) return null;

        return (
          <div style={{
            position: 'fixed',
            top: isAppHeaderVisible ? '64px' : '0px',
            left: 0,
            right: 0,
            zIndex: 999,
            backgroundColor: (isSubExpired || isCompanySuspended) ? '#dc2626' : '#d97706',
            color: '#ffffff',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '10px'
          }}>
            <i className={(isSubExpired || isCompanySuspended) ? "fa-solid fa-triangle-exclamation text-white" : "fa-solid fa-clock text-white"}></i>
            <span>
              {(isSubExpired || isCompanySuspended) ? (
                <><strong>ABONNEMENT EXPIRÉ / IMPAYÉ :</strong> Votre redevance d'abonnement SaaS est arrivée à échéance. Veuillez contacter l'administration pour régulariser votre compte.</>
              ) : (
                <><strong>RAPPEL ÉCHÉANCE ABONNEMENT :</strong> Votre abonnement expire dans {daysLeft} jour(s) ({expiresDate ? expiresDate.toLocaleDateString('fr-FR') : ''}). Pensez à renouveler votre licence.</>
              )}
            </span>
          </div>
        );
      })()}

      {/* ── NAVBAR (EN-TÊTE PRINCIPAL) - Masqué sur la page d'accueil / connexion ou si non connecté ── */}
      {isAppHeaderVisible && (
        <header className="app-main-navbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '64px', minHeight: '64px', maxHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexWrap: 'nowrap', overflow: 'visible', zIndex: 1000 }}>
          
          {/* ── SECTEUR GAUCHE : Menu Burger, Bouton Retour, Logo/Titre, Sélecteur de Boutique ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            
            {/* Menu Burger (Mobile/Tablette) */}
            <button className="burger-btn" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
              <span></span><span></span><span></span>
            </button>

            {/* Bouton Retour (Historique navigation) */}
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
                <span className="d-none d-sm-inline">Retour</span>
              </button>
            )}

            {/* Logo & Nom Entreprise */}
            <div className="navbar-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
              <img 
                src={getCompanyLogoUrl(user?.company?.logo_path)} 
                alt="Logo" 
                className="navbar-logo-img" 
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = logo; }}
              />
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                {user?.company?.name ? (
                  <>
                    <span className="logo-text-apex" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                      {user.company.name}
                    </span>
                    {user.company.slogan && (
                      <span style={{ fontSize: '0.6rem', color: 'var(--color-primary-light, #a78bfa)', fontWeight: 500, letterSpacing: '0.02em', opacity: 0.85 }}>
                        {user.company.slogan}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="logo-text-apex">Apex</span>
                    <span className="logo-text-pos">POS</span>
                  </>
                )}
              </span>
            </div>

            {/* Sélecteur / Badge de boutique */}
            {user && !isSuperAdmin && (
              isAdmin ? (
                <button 
                  className="navbar-branch-pill-btn d-none d-sm-flex" 
                  onClick={() => navigate('select-branch')}
                  title="Changer d'espace de travail / boutique active"
                >
                  <i className="fa-solid fa-store text-primary"></i>
                  <span className="branch-pill-name">{activeBranch?.name || 'Sélectionner une boutique'}</span>
                  <i className="fa-solid fa-chevron-down ms-1 text-muted" style={{ fontSize: '10px' }}></i>
                </button>
              ) : (
                <div className="navbar-branch-badge-readonly d-none d-sm-flex">
                  <i className="fa-solid fa-shop text-success me-1"></i>
                  <span>{activeBranch?.name || user?.branch?.name || 'Ma Boutique'}</span>
                </div>
              )
            )}
          </div>

          {/* ── SECTEUR CENTRE : Breadcrumb Page Active ── */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* Nom de la page active — visible dès md */}
            <div className="d-none d-md-flex" style={{ alignItems: 'center', gap: '8px', maxWidth: '100%', overflow: 'hidden' }}>
              {/* Icône + label de la page active */}
              {(() => {
                const currentLink = navLinksMap[activeTab];
                const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
                return currentLink ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    maxWidth: '100%',
                    overflow: 'hidden',
                  }}>
                    <i className={`fa-solid ${currentLink.icon} text-primary`} style={{ fontSize: '12px', flexShrink: 0 }} />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {currentLink.label}
                    </span>
                    <span style={{ width: '1px', height: '12px', background: 'var(--border-color)', flexShrink: 0 }} />
                    <span className="d-none d-lg-inline" style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      textTransform: 'capitalize',
                    }}>
                      {today}
                    </span>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* ── SECTEUR DROITE : Horloge, Raccourci Caisse, Cloche Notifications & Profil ── */}
          <div className="navbar-right-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Horloge & Date en Direct */}
            <div className="navbar-clock-widget d-none d-lg-flex align-items-center me-1" style={{ fontSize: '12px', color: 'var(--text-muted, #6b7280)', gap: '5px', fontWeight: 600 }}>
              <i className="fa-solid fa-clock text-primary"></i>
              <span>{currentTime}</span>
            </div>

            {/* Raccourci Caisse POS */}
            {!isSuperAdmin && (
              <button 
                className="btn btn-primary btn-sm d-none d-md-inline-flex align-items-center" 
                onClick={() => navigate('pos')}
                style={{ fontWeight: 700, padding: '5px 12px', fontSize: '12px', borderRadius: '8px', whiteSpace: 'nowrap' }}
              >
                <i className="fa-solid fa-cash-register me-1"></i> Caisse POS
              </button>
            )}

            {/* Badge de statut réseau et synchronisation hors-ligne */}
            <NetworkStatusBadge />

            {/* Bouton de téléchargement / installation de l'application Mobile PWA */}
            <InstallPWAButton />

            {/* Cloche de notifications système */}
            <NotificationBell onNavigate={navigate} />

            {/* Badge Profil Utilisateur */}
            <button 
              className="navbar-user-profile-btn" 
              onClick={() => navigate('auth')}
              title={`Connecté en tant que ${user?.name} (${user?.email})`}
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
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="d-none d-sm-inline" style={{ fontWeight: 600, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </span>
            </button>
          </div>
        </header>
      )}

      {/* ── OVERLAY DU MENU DRAWER (Uniquement si le header est affiché) ── */}
      {isAppHeaderVisible && (
        <div className={`drawer-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      )}

      {/* ── MENU DRAWER LATÉRAL (Uniquement si le header est affiché) ── */}
      {isAppHeaderVisible && (
        <nav ref={drawerRef} className={`side-drawer ${menuOpen ? 'open' : ''}`}>
          <div className="drawer-header">
            <div className="drawer-logo">
              <img 
                src={getCompanyLogoUrl(user?.company?.logo_path)} 
                alt="Logo" 
                className="navbar-logo-img" 
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = logo; }}
              />
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                {user?.company?.name ? (
                  <>
                    <span className="logo-text-apex" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                      {user.company.name}
                    </span>
                    {user.company.slogan && (
                      <span style={{ fontSize: '0.62rem', color: 'var(--color-primary-light, #a78bfa)', fontWeight: 500, opacity: 0.85 }}>
                        {user.company.slogan}
                      </span>
                    )}
                  </>
                ) : (
                  <span><span className="logo-text-apex">Apex</span><span className="logo-text-pos">POS</span></span>
                )}
              </span>
            </div>
            <button className="drawer-close-btn" onClick={() => setMenuOpen(false)} aria-label="Fermer">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="drawer-links">
            <InstallPWAButton isMobileDrawer={true} />
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
            {navGroups.map(grp => {
              const visibleItems = grp.items.filter(tabKey => navLinksMap[tabKey] && navLinksMap[tabKey].show);
              if (visibleItems.length === 0) return null;

              const isExpanded = !grp.collapsible || !!openNavGroups[grp.id];
              const hasActiveChild = visibleItems.includes(activeTab);

              return (
                <div key={grp.id} className="drawer-nav-group">
                  {grp.collapsible ? (
                    <button 
                      type="button"
                      className={`drawer-group-header ${hasActiveChild ? 'has-active' : ''}`}
                      onClick={() => toggleNavGroup(grp.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className={`fa-solid ${grp.icon || 'fa-folder'} text-primary`} style={{ fontSize: '13px' }}></i>
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>{grp.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge-count" style={{ fontSize: '10px', padding: '1px 6px', opacity: 0.8, borderRadius: '8px' }}>{visibleItems.length}</span>
                        <i className={`fa-solid fa-chevron-down chevron-icon ${isExpanded ? 'rotated' : ''}`} style={{ fontSize: '11px' }}></i>
                      </div>
                    </button>
                  ) : (
                    <div className="drawer-group-title-static">{grp.title}</div>
                  )}

                  {isExpanded && (
                    <div className={`drawer-group-content ${grp.collapsible ? 'pliable-content' : ''}`}>
                      {visibleItems.map(tabKey => {
                        const { icon, label } = navLinksMap[tabKey];
                        return (
                          <button 
                            key={tabKey} 
                            className={`drawer-link-btn ${activeTab === tabKey ? 'active' : ''}`} 
                            onClick={() => navigate(tabKey)}
                          >
                            <i className={`fa-solid ${icon}`}></i>
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
      )}

      {/* ── CONTENU PRINCIPAL (Pulsation pleine page sans header sur home/auth) ── */}
      {(() => {
        const expiresAtStr = user?.company?.subscription_expires_at;
        const isCompanySuspended = user?.company?.status === 'suspended' || user?.company?.status === 'inactive';
        const expiresDate = expiresAtStr ? new Date(expiresAtStr) : null;
        const now = new Date();
        const daysLeft = expiresDate ? Math.ceil((expiresDate - now) / (1000 * 60 * 60 * 24)) : null;

        const isSubExpired = expiresDate && expiresDate < now;
        const isSubExpiringSoon = !isSubExpired && daysLeft !== null && daysLeft <= 7;
        const showSubWarning = isAuthenticated && !isSuperAdmin && (isSubExpired || isCompanySuspended || isSubExpiringSoon);

        const calculatedPaddingTop = isAppHeaderVisible ? (showSubWarning ? '104px' : '74px') : (showSubWarning ? '36px' : '0px');

        return (
          <main className="app-main-content" style={{ paddingTop: calculatedPaddingTop, minHeight: isAppHeaderVisible ? 'calc(100vh - 74px)' : '100vh', width: '100%', boxSizing: 'border-box' }}>
            {renderContent()}
          </main>
        );
      })()}
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
          padding: 12px 10px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .drawer-links::-webkit-scrollbar { width: 4px; }
        .drawer-links::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }

        /* GROUPES D'ONGLETS PLIABLES (ACCORDION) */
        .drawer-nav-group {
          margin-bottom: 4px;
        }

        .drawer-group-title-static {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          padding: 6px 12px 2px 12px;
          opacity: 0.75;
        }

        .drawer-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          background: var(--bg-input, rgba(255,255,255,0.04));
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .drawer-group-header:hover {
          background: var(--bg-card);
          border-color: var(--color-primary);
        }

        .drawer-group-header.has-active {
          border-color: var(--color-primary);
          background: rgba(59, 130, 246, 0.08);
        }

        .chevron-icon {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
        }

        .pliable-content {
          padding-left: 6px;
          border-left: 2px solid var(--border-color);
          margin-left: 10px;
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .drawer-link-btn {
          display: flex; align-items: center; gap: 12px;
          width: 100%; padding: 10px 14px;
          border-radius: 10px; background: transparent; border: none;
          color: var(--text-muted);
          font-family: var(--font-title); font-weight: 600; font-size: 13.5px;
          cursor: pointer; text-align: left;
          transition: all var(--transition-fast);
        }
        .drawer-link-btn i { width: 20px; text-align: center; font-size: 14px; flex-shrink: 0; }
        .drawer-link-btn:hover { background: var(--bg-input); color: var(--text-main); transform: translateX(3px); }
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
    <ErrorBoundary>
      <AppProvider>
        <ThemeSelector />
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App
