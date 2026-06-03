import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiLogin, apiRegister, apiLogout, getStoredUser, getStoredWorkspaces, getActiveWorkspaceSlug, setActiveWorkspaceSlug } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(() => getStoredUser());
  const [workspaces, setWorkspaces] = useState(() => getStoredWorkspaces());
  const [activeSlug, setActiveSlug] = useState(() => getActiveWorkspaceSlug());
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const isAuthenticated = !!user && !!getActiveWorkspaceSlug();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(email.trim().toLowerCase(), password);
      setUser(data.user);
      setWorkspaces(data.workspaces);
      const slug = data.workspaces?.[0]?.slug || '';
      setActiveSlug(slug);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      await apiRegister(name, normalizedEmail, password);
      const data = await apiLogin(normalizedEmail, password);
      setUser(data.user);
      setWorkspaces(data.workspaces);
      setActiveSlug(data.workspaces?.[0]?.slug || '');
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setWorkspaces([]);
    setActiveSlug('');
  }, []);

  const switchWorkspace = useCallback((slug) => {
    setActiveWorkspaceSlug(slug);
    setActiveSlug(slug);
  }, []);

  const value = { user, workspaces, activeSlug, workspaceSlug: activeSlug, isAuthenticated, loading, error, login, register, logout, switchWorkspace };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
