import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("ht_user");
    const storedToken = localStorage.getItem("ht_token");
    if (storedUser && storedToken) {
      try { setUser(JSON.parse(storedUser)); } catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("ht_token", data.token);
    localStorage.setItem("ht_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("ht_token", data.token);
    localStorage.setItem("ht_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ht_token");
    localStorage.removeItem("ht_user");
    setUser(null);
  }, []);

  const updatePreferences = useCallback(async (preferences) => {
    const data = await api.put("/auth/preferences", preferences);
    const updated = { ...user, preferences: data.preferences };
    localStorage.setItem("ht_user", JSON.stringify(updated));
    setUser(updated);
    return data;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, register, login, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};