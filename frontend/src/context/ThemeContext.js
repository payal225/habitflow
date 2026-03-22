import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ht_theme");
    if (stored !== null) {
      const isDark = stored === "dark";
      setDarkMode(isDark);
      applyTheme(isDark);
    } else {
      applyTheme(true);
    }
  }, []);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.setProperty("--bg-primary", "#080c14");
      root.style.setProperty("--bg-card", "#111827");
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--text-secondary", "#94a3b8");
      root.style.setProperty("--text-muted", "#475569");
      root.style.setProperty("--border", "rgba(255,255,255,0.08)");
      root.style.setProperty("--border-hover", "rgba(255,255,255,0.15)");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--bg-primary", "#f8fafc");
      root.style.setProperty("--bg-card", "#ffffff");
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--text-muted", "#94a3b8");
      root.style.setProperty("--border", "#e2e8f0");
      root.style.setProperty("--border-hover", "#cbd5e1");
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    applyTheme(newMode);
    localStorage.setItem("ht_theme", newMode ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
