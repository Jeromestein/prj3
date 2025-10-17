import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  loginRequest,
  logoutRequest,
  meRequest,
  signupRequest,
} from '../api/auth';
import { handleApiError } from '../api/client';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const refreshUser = useCallback(async () => {
    setStatus('loading');
    try {
      const { data } = await meRequest();
      setUser(data.user);
      setStatus('ready');
      setError(null);
    } catch (err) {
      setUser(null);
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signup = useCallback(async (payload) => {
    setError(null);
    try {
      const { data } = await signupRequest(payload);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      return { success: false, message };
    }
  }, []);

  const login = useCallback(async (payload) => {
    setError(null);
    try {
      const { data } = await loginRequest(payload);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await logoutRequest();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      status,
      error,
      clearError: () => setError(null),
      signup,
      login,
      logout,
      refreshUser,
    }),
    [user, status, error, signup, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
