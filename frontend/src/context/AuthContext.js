import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEYS = {
  token: "token",
  username: "username",
  userId: "userId"
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.token);
    localStorage.removeItem(AUTH_STORAGE_KEYS.username);
    localStorage.removeItem(AUTH_STORAGE_KEYS.userId);
    setUser(null);
  }, []);

  const login = (token, username, userId) => {
    localStorage.setItem(AUTH_STORAGE_KEYS.token, token);
    localStorage.setItem(AUTH_STORAGE_KEYS.username, username);
    localStorage.setItem(AUTH_STORAGE_KEYS.userId, String(userId));
    setUser({ username, userId });
  };

  useEffect(() => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
    const username = localStorage.getItem(AUTH_STORAGE_KEYS.username);
    const userId = localStorage.getItem(AUTH_STORAGE_KEYS.userId);
    if (token && username && userId) {
      setUser({ username, userId: Number(userId) });
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    user,
    login,
    logout,
    authLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
