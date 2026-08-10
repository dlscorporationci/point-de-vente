import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { offlineStorage } from '../services/offlineStorage';
import { purgeLocalCacheOnLogout } from '../services/db';
import { realtimeService } from '../services/RealtimeService';

const AppContext = createContext(null);

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (window.location.port === '5173' || window.location.port === '3000')) {
      if (localStorage.getItem('use-production-api') === 'true') {
        return 'https://pos.dlscorporation.ci/api';
      }
      return 'http://127.0.0.1:8000/api';
    }
  }
  return '/api';
};

axios.defaults.baseURL = getApiBaseUrl();

export const AppProvider = ({ children }) => {
  // 1. Gestion du thème et du UI Kit
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [uiKit, setUiKitState] = useState(() => {
    return localStorage.getItem('ui-kit') || 'corporate';
  });

  // 2. Gestion du Tenant (Multi-Tenancy)
  const [companyId, setCompanyIdState] = useState(() => {
    let savedCompany = localStorage.getItem('company-id');
    if (!savedCompany || savedCompany === 'null' || savedCompany === 'undefined') {
      const savedUserStr = localStorage.getItem('user');
      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u && u.company_id) savedCompany = String(u.company_id);
        } catch {}
      }
    }
    if (!savedCompany || savedCompany === 'null' || savedCompany === 'undefined') {
      savedCompany = '1';
    }
    localStorage.setItem('company-id', savedCompany);
    axios.defaults.headers.common['X-Company-ID'] = savedCompany;
    return savedCompany;
  });

  const [branchId, setBranchIdState] = useState(() => {
    const savedBranch = localStorage.getItem('branch-id');
    if (savedBranch) {
      axios.defaults.headers.common['X-Branch-ID'] = savedBranch;
    }
    return savedBranch || null;
  });

  // 3. Gestion de l'authentification
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && savedToken !== 'null' && savedToken !== 'undefined' && savedToken.trim() !== '') {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      return savedToken;
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved && saved !== 'null' && saved !== 'undefined') {
      try {
        const parsed = JSON.parse(saved);
        return (parsed && (parsed.id || parsed.email)) ? parsed : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // 4. Gestion du statut Réseau & Moteur de Synchronisation Automatique
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingSalesCount, setPendingSalesCount] = useState(() => offlineStorage.getPendingSales().length);
  const [isSyncing, setIsSyncing] = useState(false);

  // 4b. Statut de la connexion SSE temps réel
  const [realtimeStatus, setRealtimeStatus] = useState('disconnected'); // 'connected' | 'connecting' | 'disconnected' | 'error'

  // 5. Gestion du Mode Maintenance Applicatif Global
  const [maintenanceInfo, setMaintenanceInfo] = useState(null);

  const refreshPendingSalesCount = useCallback(() => {
    setPendingSalesCount(offlineStorage.getPendingSales().length);
  }, []);

  const syncOfflineSales = useCallback(async () => {
    if (!navigator.onLine || !localStorage.getItem('token')) return;
    const pending = offlineStorage.getPendingSales();
    if (pending.length === 0) {
      setPendingSalesCount(0);
      return;
    }

    setIsSyncing(true);
    for (const sale of pending) {
      try {
        const payload = {
          branch_id: sale.branch_id,
          cash_session_id: sale.cash_session_id,
          payment_method: sale.payment_method,
          amount_received: sale.amount_received,
          client_name: sale.client_name,
          client_phone: sale.client_phone,
          customer_id: sale.customer_id,
          discount: sale.discount,
          tax: sale.tax,
          items: sale.items
        };

        await axios.post('/v1/sales', payload);
        offlineStorage.removePendingSale(sale._local_id);
      } catch (err) {
        console.warn('Échec de synchronisation vente déconnectée:', sale, err);
        if (err.response && err.response.status >= 400 && err.response.status < 500) {
          offlineStorage.removePendingSale(sale._local_id);
        }
      }
    }
    refreshPendingSalesCount();
    setIsSyncing(false);
  }, [refreshPendingSalesCount]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineSales();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      syncOfflineSales();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineSales]);

  // Appliquer les attributs de thème sur document.documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-ui-kit', uiKit);
    localStorage.setItem('ui-kit', uiKit);
  }, [uiKit]);

  // Synchroniser et configurer les en-têtes de Tenant sur Axios
  useEffect(() => {
    if (companyId) {
      axios.defaults.headers.common['X-Company-ID'] = companyId;
      localStorage.setItem('company-id', companyId);
    } else {
      delete axios.defaults.headers.common['X-Company-ID'];
      localStorage.removeItem('company-id');
    }
  }, [companyId]);

  useEffect(() => {
    if (branchId) {
      axios.defaults.headers.common['X-Branch-ID'] = branchId;
      localStorage.setItem('branch-id', branchId);
    } else {
      delete axios.defaults.headers.common['X-Branch-ID'];
      localStorage.removeItem('branch-id');
    }
  }, [branchId]);

  // Configurer l'en-tête authorization d'Axios si un token est présent
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Intercepteur Axios global : Détection maintenance (503) et rafraîchissement des notifications
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        const method = response.config?.method?.toLowerCase();
        const url = response.config?.url || '';
        if (['post', 'put', 'patch', 'delete'].includes(method) && !url.includes('/notifications')) {
          setTimeout(() => {
            window.dispatchEvent(new Event('notification-refresh'));
          }, 300);
        }
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 503) {
          const data = error.response.data || {};
          setMaintenanceInfo({
            message: data.message || 'L\'application est actuellement en cours de maintenance.',
            started_at: data.started_at,
            estimated_end_at: data.estimated_end_at
          });
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Polling automatique de l'état de maintenance applicative (toutes les 15s)
  const checkMaintenanceStatus = useCallback(async () => {
    try {
      const res = await axios.get('/v1/maintenance/status');
      if (res.data && res.data.in_maintenance) {
        setMaintenanceInfo(res.data.maintenance || { message: 'L\'application est en maintenance.' });
      } else {
        setMaintenanceInfo(null);
      }
    } catch {
      // Ignorer si déconnecté
    }
  }, []);

  useEffect(() => {
    checkMaintenanceStatus();
    const interval = setInterval(checkMaintenanceStatus, 15000);
    return () => clearInterval(interval);
  }, [checkMaintenanceStatus]);

  // ─── Refresh automatique des données utilisateur (zones d'accès, rôles, etc.) ───
  // Nécessaire pour que les modifications de zone/rôle faites par l'admin
  // s'appliquent immédiatement sans reconnexion.
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken || !navigator.onLine) return;
    try {
      const res = await axios.get('/v1/auth/me');
      const freshUser = res.data?.user || res.data;
      if (freshUser && (freshUser.id || freshUser.email)) {
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      }
    } catch {
      // Silencieux si token expiré (le 401 interceptor gère la déconnexion)
    }
  }, []);

  // Refresh toutes les 60 secondes si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const interval = setInterval(refreshUser, 60000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  // Refresh immédiat sur événement 'access-zone-updated' (déclenché par AccessZonesModal)
  useEffect(() => {
    const handler = () => refreshUser();
    window.addEventListener('access-zone-updated', handler);
    return () => window.removeEventListener('access-zone-updated', handler);
  }, [refreshUser]);

  // Synchroniser l'utilisateur dans le stockage local
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const [activeBranch, setActiveBranchState] = useState(() => {
    const saved = localStorage.getItem('active-branch');
    return saved ? JSON.parse(saved) : null;
  });

  const [assignedBranches, setAssignedBranches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Synchroniser la boutique active dans Axios
  useEffect(() => {
    if (activeBranch?.id || branchId) {
      const bId = activeBranch?.id || branchId;
      axios.defaults.headers.common['X-Branch-ID'] = bId;
      localStorage.setItem('branch-id', bId);
    } else {
      delete axios.defaults.headers.common['X-Branch-ID'];
      localStorage.removeItem('branch-id');
    }
  }, [activeBranch, branchId]);

  // Récupérer les notifications
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/v1/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch {
      /* silencieux */
    }
  };

  // Basculer la boutique active
  const switchActiveBranch = async (targetBranchId) => {
    try {
      if (navigator.onLine) {
        const res = await axios.post('/v1/auth/switch-branch', { branch_id: parseInt(targetBranchId) });
        const newActive = res.data.active_branch;
        setActiveBranchState(newActive);
        setBranchIdState(newActive.id.toString());
        localStorage.setItem('active-branch', JSON.stringify(newActive));
        localStorage.setItem('branch-id', newActive.id.toString());
        axios.defaults.headers.common['X-Branch-ID'] = newActive.id;

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('branch-switched', { detail: newActive }));
        }

        return { success: true, message: res.data.message };
      } else {
        const cached = localStorage.getItem('cached-branches');
        let branchesList = [];
        if (cached) { try { branchesList = JSON.parse(cached); } catch {} }
        
        const targetBranch = branchesList.find(b => b.id === parseInt(targetBranchId)) 
          || (user?.assigned_branches || user?.branches || []).find(b => b.id === parseInt(targetBranchId))
          || { id: parseInt(targetBranchId), name: 'Boutique (Hors-Ligne)' };

        setActiveBranchState(targetBranch);
        setBranchIdState(targetBranch.id.toString());
        localStorage.setItem('active-branch', JSON.stringify(targetBranch));
        localStorage.setItem('branch-id', targetBranch.id.toString());
        axios.defaults.headers.common['X-Branch-ID'] = targetBranch.id.toString();

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('branch-switched', { detail: targetBranch }));
        }

        return { success: true, message: 'Changement de boutique effectué hors-ligne.' };
      }
    } catch (err) {
      if (!navigator.onLine) {
        const targetBranch = { id: parseInt(targetBranchId), name: 'Boutique (Hors-Ligne)' };
        setActiveBranchState(targetBranch);
        setBranchIdState(targetBranch.id.toString());
        localStorage.setItem('active-branch', JSON.stringify(targetBranch));
        localStorage.setItem('branch-id', targetBranch.id.toString());
        axios.defaults.headers.common['X-Branch-ID'] = targetBranch.id.toString();
        return { success: true, message: 'Changement de boutique effectué hors-ligne.' };
      }
      return { success: false, error: err.response?.data?.error || 'Impossible de changer de boutique.' };
    }
  };

  const login = (userData, userToken) => {
    // 0. Réinitialisation étanche des anciennes clés d'en-tête et du stockage local
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['X-Company-ID'];
    delete axios.defaults.headers.common['X-Branch-ID'];
    localStorage.removeItem('cached-branches');
    localStorage.removeItem('active-branch');
    localStorage.removeItem('branch-id');
    localStorage.removeItem('company-id');

    // 1. Configuration SYNCHRONE immédiate d'Axios pour éviter d'envoyer la première requête sans jeton
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    localStorage.setItem('token', userToken);

    const compId = userData.company_id ? userData.company_id.toString() : '1';
    axios.defaults.headers.common['X-Company-ID'] = compId;
    localStorage.setItem('company-id', compId);
    setCompanyIdState(compId);

    const activeBr = userData.active_branch
      || (userData.branch?.id ? { id: userData.branch.id, name: userData.branch.name } : null)
      || (userData.assigned_branches && userData.assigned_branches.length > 0 ? userData.assigned_branches[0] : null)
      || { id: 1, name: 'Boutique Centrale' };

    userData.active_branch = activeBr;
    axios.defaults.headers.common['X-Branch-ID'] = activeBr.id.toString();
    localStorage.setItem('branch-id', activeBr.id.toString());
    localStorage.setItem('active-branch', JSON.stringify(activeBr));
    setActiveBranchState(activeBr);
    setBranchIdState(activeBr.id.toString());

    setToken(userToken);
    setUser(userData);

    if (userData.assigned_branches) {
      setAssignedBranches(userData.assigned_branches);
    }

    // Connexion SSE temps réel après login réussi
    // Utiliser un léger délai pour laisser le temps à Axios de configurer les headers
    setTimeout(() => {
      realtimeService.connect({
        token: userToken,
        companyId: userData.company_id?.toString(),
        branchId: (userData.active_branch?.id || userData.branch?.id)?.toString(),
        userId: userData.id?.toString(),
      });
    }, 200);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setActiveBranchState(null);
    setAssignedBranches([]);
    setNotifications([]);
    setUnreadCount(0);
    setCompanyIdState(null);
    setBranchIdState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('company-id');
    localStorage.removeItem('branch-id');
    localStorage.removeItem('active-branch');
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['X-Company-ID'];
    delete axios.defaults.headers.common['X-Branch-ID'];

    // Purge du cache local sensible Dexie lors du logout (tout en conservant les pending non-sync)
    purgeLocalCacheOnLogout().catch(() => {});

    // Déconnexion SSE temps réel au logout
    realtimeService.disconnect();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('app-logout'));
    }
  };

  // Intercepteur Axios pour gérer les erreurs 401 (Déconnexion automatique uniquement si jeton révoqué)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const url = error.config?.url || '';
          const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/login-pin');
          const isBackgroundEndpoint = url.includes('/notifications') || url.includes('/maintenance') || url.includes('/tenant-test');

          if (!isAuthEndpoint && !isBackgroundEndpoint) {
            const msg = String(error.response.data?.message || error.response.data?.error || '');
            if (msg.includes('Unauthenticated') || msg.includes('expiré') || url.includes('/auth/me')) {
              logout();
            }
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Abonnement aux changements de statut SSE
  useEffect(() => {
    const cleanup = realtimeService.onStatusChange(setRealtimeStatus);
    return cleanup;
  }, []);

  // Reconnexion SSE lors du changement de boutique
  useEffect(() => {
    const handleBranchSwitch = () => {
      const currentToken = localStorage.getItem('token');
      const newBranchId  = localStorage.getItem('branch-id');
      const newCompanyId = localStorage.getItem('company-id');
      if (currentToken && newCompanyId) {
        // Déconnecter l'ancienne connexion SSE
        realtimeService.disconnect();
        // Se reconnecter avec le nouveau contexte boutique
        setTimeout(() => {
          realtimeService.connect({
            token:     currentToken,
            companyId: newCompanyId,
            branchId:  newBranchId,
            userId:    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.id?.toString() : null,
          });
        }, 300);
      }
    };
    window.addEventListener('branch-switched', handleBranchSwitch);
    return () => window.removeEventListener('branch-switched', handleBranchSwitch);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const setUiKit = (newUiKit) => {
    setUiKitState(newUiKit);
  };

  const setCompanyId = (newCompanyId) => {
    setCompanyIdState(newCompanyId);
  };

  const setBranchId = (newBranchId) => {
    setBranchIdState(newBranchId);
  };

  // Met à jour le branding complet de l'entreprise en mémoire (logo, slogan, favicon, nom)
  const updateCompanyLogo = useCallback((newLogoPath, brandingUpdates = {}) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        company: {
          ...(prev.company || {}),
          ...(newLogoPath !== undefined ? { logo_path: newLogoPath } : {}),
          ...(brandingUpdates.name !== undefined ? { name: brandingUpdates.name } : {}),
          ...(brandingUpdates.slogan !== undefined ? { slogan: brandingUpdates.slogan } : {}),
          ...(brandingUpdates.favicon_path !== undefined ? { favicon_path: brandingUpdates.favicon_path } : {}),
        }
      };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      uiKit,
      setUiKit,
      companyId,
      setCompanyId,
      branchId,
      setBranchId,
      activeBranch,
      assignedBranches,
      switchActiveBranch,
      notifications,
      unreadCount,
      fetchNotifications,
      user,
      setUser,
      token,
      login,
      logout,
      updateCompanyLogo,
      refreshUser,
      isOnline,
      pendingSalesCount,
      isSyncing,
      syncOfflineSales,
      refreshPendingSalesCount,
      maintenanceInfo,
      checkMaintenanceStatus,
      realtimeStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé au sein d\'un AppProvider');
  }
  return context;
};
