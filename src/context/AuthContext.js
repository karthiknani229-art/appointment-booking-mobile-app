import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, StorageKeys } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const storedUser = await storage.getItem(StorageKeys.USER);
      if (storedUser) setUser(storedUser);
    } catch (e) {
      console.error('Session check error:', e);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, phone }) => {
    try {
      const usersDB = (await storage.getItem(StorageKeys.USERS_DB)) || {};
      if (usersDB[email]) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        phone,
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C63FF&color=fff&size=128`,
      };
      usersDB[email] = newUser;
      await storage.setItem(StorageKeys.USERS_DB, usersDB);
      const { password: _, ...safeUser } = newUser;
      await storage.setItem(StorageKeys.USER, safeUser);
      setUser(safeUser);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const usersDB = (await storage.getItem(StorageKeys.USERS_DB)) || {};
      const found = usersDB[email];
      if (!found) {
        return { success: false, message: 'No account found with this email.' };
      }
      if (found.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      const { password: _, ...safeUser } = found;
      await storage.setItem(StorageKeys.USER, safeUser);
      setUser(safeUser);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    await storage.removeItem(StorageKeys.USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
