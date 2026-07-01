import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const FestiveThemeContext = createContext({ theme: null, loading: true, refreshTheme: async () => {} });

const defaultColors = {
  primary: "#a86445",
  secondary: "#bd9359",
  background: "#fffdfa"
};

const setThemeVariables = (theme) => {
  const colors = theme?.themeColors || {};
  document.documentElement.style.setProperty("--primary-color", colors.primary || defaultColors.primary);
  document.documentElement.style.setProperty("--secondary-color", colors.secondary || defaultColors.secondary);
  document.documentElement.style.setProperty("--bg-color", colors.background || defaultColors.background);
};

export function FestiveThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshTheme = useCallback(async () => {
    try {
      const { data } = await api.get(`/festive/active?_=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache" }
      });
      setTheme(data || null);
      return data || null;
    } catch (error) {
      setTheme(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTheme();
    const interval = window.setInterval(refreshTheme, 30000);
    return () => window.clearInterval(interval);
  }, [refreshTheme]);

  useEffect(() => {
    setThemeVariables(theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, loading, refreshTheme }), [theme, loading, refreshTheme]);

  return <FestiveThemeContext.Provider value={value}>{children}</FestiveThemeContext.Provider>;
}

export const useFestiveTheme = () => useContext(FestiveThemeContext);
