import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading]     = useState(true);

useEffect(() => {
  const loadAuthUser = () => {
    const savedUser = authService.getUser();
    const isAuth = authService.isAuthenticated();

    if (isAuth && savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }

    setLoading(false);
  };

  loadAuthUser();

  window.addEventListener('storage', loadAuthUser);
  window.addEventListener('auth-changed', loadAuthUser);

  return () => {
    window.removeEventListener('storage', loadAuthUser);
    window.removeEventListener('auth-changed', loadAuthUser);
  };
}, []);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    window.dispatchEvent(new Event('auth-changed'));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    window.dispatchEvent(new Event('auth-changed'));
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const updateUser = useCallback((userData) => {
    const updated = authService.updateUser(userData);
    setUser(updated);
  }, []);

  const role      = user?.role || null;
  const isAdmin   = role === 'super_admin' || role === 'sub_admin';
  const isCustomer = role === 'customer';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
    </div>
  );

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, role,
      isAdmin, isCustomer,
      login, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}