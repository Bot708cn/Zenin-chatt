import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ActiveScreen } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentScreen: ActiveScreen;
  pendingUser: { email: string; name?: string } | null;
  activeConversationId: string | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  navigateTo: (screen: ActiveScreen) => void;
  openConversation: (convId: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  adminLogin: (secretCode: string) => Promise<void>;
  logout: () => Promise<void>;
  adminLogout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to detect if current URL is an admin URL
export const isSecretAdminUrl = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hash = (window.location.hash || '').toLowerCase();
  const path = (window.location.pathname || '').toLowerCase();
  const search = (window.location.search || '').toLowerCase();
  return (
    hash.includes('admin') ||
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path.startsWith('/admin-login') ||
    search.includes('admin=') ||
    search === '?admin'
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>(() => {
    // Initial screen: if loaded directly on secret admin URL, show admin screen
    if (isSecretAdminUrl()) {
      return api.getAdminToken() ? 'admin-dashboard' : 'admin-login';
    }
    return 'splash';
  });
  const [pendingUser, setPendingUser] = useState<{ email: string; name?: string } | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const navigateTo = (screen: ActiveScreen) => {
    setError(null);

    // Sync admin URL hash when entering or leaving admin screens
    const adminScreens: ActiveScreen[] = [
      'admin-login',
      'admin-dashboard',
      'admin-users',
      'admin-requests',
      'admin-messages',
      'admin-bans',
      'admin-settings',
    ];

    if (adminScreens.includes(screen)) {
      if (typeof window !== 'undefined' && !window.location.hash.includes('admin') && !window.location.pathname.includes('admin')) {
        window.location.hash = 'admin';
      }
    } else {
      if (typeof window !== 'undefined' && window.location.hash.includes('admin')) {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) {
          window.location.hash = '';
        }
      }
    }

    setCurrentScreen(screen);
  };

  const openConversation = (convId: string) => {
    setActiveConversationId(convId);
    setCurrentScreen('app-chat');
  };

  // Check existing sessions on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const adminToken = api.getAdminToken();
        const userToken = api.getUserToken();

        // 1. Check if admin session exists
        if (adminToken) {
          try {
            const me = await api.getMe(true);
            if (me.role === 'ADMIN' || me.isAdmin) {
              setIsAdmin(true);
              if (isSecretAdminUrl()) {
                setCurrentScreen('admin-dashboard');
              }
            } else {
              api.setAdminToken(null);
              setIsAdmin(false);
            }
          } catch (e) {
            api.setAdminToken(null);
            setIsAdmin(false);
          }
        }

        // 2. Check if student session exists
        if (userToken) {
          try {
            const res = await api.getMe(false);
            if (res.user) {
              setCurrentUser(res.user);
            } else {
              api.setUserToken(null);
              setCurrentUser(null);
            }
          } catch (e: any) {
            api.setUserToken(null);
            setCurrentUser(null);
          }
        }
      } catch (e) {
        // Not logged in yet
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen to hash and URL navigation so admin URL works seamlessly (e.g. typing #admin or /admin)
  useEffect(() => {
    const handleUrlChange = () => {
      if (isSecretAdminUrl()) {
        const adminToken = api.getAdminToken();
        if (adminToken) {
          setIsAdmin(true);
          setCurrentScreen('admin-dashboard');
        } else {
          setCurrentScreen('admin-login');
        }
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const refreshUserData = async () => {
    try {
      if (api.getUserToken()) {
        const res = await api.getMe();
        if (res.user) {
          setCurrentUser(res.user);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await api.login({ email, password });
      setCurrentUser(res.user);
      setIsAdmin(false);
      navigateTo('app-chat');
    } catch (err: any) {
      if (err.data?.status === 'PENDING') {
        setPendingUser({ email });
        navigateTo('pending');
        return;
      }
      if (err.data?.banned) {
        setError(`Votre compte a été banni : ${err.data.banReason || 'Infraction au règlement'}`);
        return;
      }
      setError(err.message || 'Identifiants incorrects.');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    setError(null);
    try {
      await api.register({ name, email, password, confirmPassword });
      setPendingUser({ email, name });
      navigateTo('pending');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’inscription.');
      throw err;
    }
  };

  const adminLogin = async (secretCode: string) => {
    setError(null);
    try {
      await api.adminLogin(secretCode);
      setIsAdmin(true);
      navigateTo('admin-dashboard');
    } catch (err: any) {
      setError(err.message || 'Code secret administrateur incorrect.');
      throw err;
    }
  };

  const logout = async () => {
    await api.logout();
    setCurrentUser(null);
    navigateTo('logged-out');
  };

  const adminLogout = () => {
    api.adminLogout();
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      try {
        history.replaceState(null, '', window.location.pathname.replace(/\/admin.*/, '') || '/');
      } catch (e) {
        window.location.hash = '';
      }
    }
    navigateTo('logged-out');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        currentScreen,
        pendingUser,
        activeConversationId,
        loading,
        error,
        clearError,
        navigateTo,
        openConversation,
        login,
        register,
        adminLogin,
        logout,
        adminLogout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
