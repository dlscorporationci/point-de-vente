import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AppContext = createContext(null);

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (window.location.port === '5173' || window.location.port === '3000')) {
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
    const savedCompany = localStorage.getItem('company-id');
    if (savedCompany) {
      axios.defaults.headers.common['X-Company-ID'] = savedCompany;
    }
    return savedCompany || null;
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

  // Intercepteur Axios global : Rafraîchir instantanément les notifications après toute action (POST, PUT, DELETE)
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
      (error) => Promise.reject(error)
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

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
      const res = await axios.post('/v1/auth/switch-branch', { branch_id: parseInt(targetBranchId) });
      const newActive = res.data.active_branch;
      setActiveBranchState(newActive);
      setBranchIdState(newActive.id.toString());
      localStorage.setItem('active-branch', JSON.stringify(newActive));
      localStorage.setItem('branch-id', newActive.id.toString());
      axios.defaults.headers.common['X-Branch-ID'] = newActive.id;
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Impossible de changer de boutique.' };
    }
  };

  const login = (userData, userToken) => {
    // 1. Configuration SYNCHRONE immédiate d'Axios pour éviter d'envoyer la première requête sans jeton
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    localStorage.setItem('token', userToken);

    if (userData.company_id) {
      axios.defaults.headers.common['X-Company-ID'] = userData.company_id.toString();
      localStorage.setItem('company-id', userData.company_id.toString());
      setCompanyIdState(userData.company_id.toString());
    } else {
      delete axios.defaults.headers.common['X-Company-ID'];
      localStorage.removeItem('company-id');
      setCompanyIdState(null);
    }

    if (userData.active_branch) {
      axios.defaults.headers.common['X-Branch-ID'] = userData.active_branch.id.toString();
      localStorage.setItem('branch-id', userData.active_branch.id.toString());
      localStorage.setItem('active-branch', JSON.stringify(userData.active_branch));
      setActiveBranchState(userData.active_branch);
      setBranchIdState(userData.active_branch.id.toString());
    } else if (userData.branch?.id) {
      const b = { id: userData.branch.id, name: userData.branch.name };
      axios.defaults.headers.common['X-Branch-ID'] = b.id.toString();
      localStorage.setItem('branch-id', b.id.toString());
      localStorage.setItem('active-branch', JSON.stringify(b));
      setActiveBranchState(b);
      setBranchIdState(b.id.toString());
    }

    setToken(userToken);
    setUser(userData);

    if (userData.assigned_branches) {
      setAssignedBranches(userData.assigned_branches);
    }
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
  };

  // Intercepteur Axios pour gérer les erreurs 401 (Déconnexion automatique uniquement si token invalide sur route privée)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const url = error.config?.url || '';
          // Ignorer les 401 provenant des requêtes de connexion pour ne pas déclencher une déconnexion en boucle
          if (!url.includes('/auth/login') && !url.includes('/auth/login-pin')) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
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
      token,
      login,
      logout
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
