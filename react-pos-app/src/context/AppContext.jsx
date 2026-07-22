import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AppContext = createContext(null);

// En production, Nginx sert frontend + API sur le même port.
// En développement local, définir VITE_API_URL=http://localhost:8000/api dans un fichier .env.local
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';

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
    return localStorage.getItem('company-id') || null;
  });

  const [branchId, setBranchIdState] = useState(() => {
    return localStorage.getItem('branch-id') || null;
  });

  // 3. Gestion de l'authentification
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
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
    setToken(userToken);
    setUser(userData);
    if (userData.company_id) {
      setCompanyIdState(userData.company_id.toString());
    } else {
      setCompanyIdState(null);
    }
    if (userData.active_branch) {
      setActiveBranchState(userData.active_branch);
      setBranchIdState(userData.active_branch.id.toString());
      localStorage.setItem('active-branch', JSON.stringify(userData.active_branch));
    } else if (userData.branch?.id) {
      const b = { id: userData.branch.id, name: userData.branch.name };
      setActiveBranchState(b);
      setBranchIdState(b.id.toString());
      localStorage.setItem('active-branch', JSON.stringify(b));
    }
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
    localStorage.removeItem('company-id');
    localStorage.removeItem('branch-id');
    localStorage.removeItem('active-branch');
    delete axios.defaults.headers.common['X-Company-ID'];
    delete axios.defaults.headers.common['X-Branch-ID'];
  };

  // Intercepteur Axios pour gérer les erreurs 401 (Déconnexion automatique si token invalide)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
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
