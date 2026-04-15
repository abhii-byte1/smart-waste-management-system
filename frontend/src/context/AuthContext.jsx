import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('smartWasteUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartWasteUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartWasteUser');
    }
  }, [user]);

  const login = async (credentials) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post('/auth/login', credentials);
      setUser(data);
      toast.success('Welcome back.');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (payload) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      setUser(data);
      toast.success('Account created successfully.');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out.');
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      login,
      register,
      logout
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
