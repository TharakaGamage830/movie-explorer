import React, { createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

// Note: Frontend demo authentication only. Real-world authentication requires a backend
// service with secure session handling, hashed passwords, and token validation.
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage(STORAGE_KEYS.isLoggedIn, false);
  const [username, setUsername] = useLocalStorage(STORAGE_KEYS.username, '');

  const login = useCallback(
    (user) => {
      setIsLoggedIn(true);
      setUsername(user);
      return true;
    },
    [setIsLoggedIn, setUsername]
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername('');
  }, [setIsLoggedIn, setUsername]);

  const value = useMemo(
    () => ({ isLoggedIn, username, login, logout }),
    [isLoggedIn, username, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
