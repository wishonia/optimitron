"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  applyThemeToRoot,
  DEFAULT_THEME,
  resolveTheme,
  THEME_STORAGE_KEY,
  toggleThemeValue,
  type Theme,
} from "@/lib/theme";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: DEFAULT_THEME, toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = resolveTheme(stored);
    setTheme(nextTheme);
    applyThemeToRoot(nextTheme);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = toggleThemeValue(prev);
      localStorage.setItem(THEME_STORAGE_KEY, next);
      applyThemeToRoot(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
