'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type DoiceladevTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: DoiceladevTheme;
  resolvedTheme: DoiceladevTheme;
  setTheme: (next: DoiceladevTheme) => void;
}

const STORAGE_KEY = 'theme';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => undefined,
});

function applyThemeClass(theme: DoiceladevTheme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: DoiceladevTheme;
  attribute?: string;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<DoiceladevTheme>(defaultTheme);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const initial: DoiceladevTheme =
        stored === 'light' || stored === 'dark' ? stored : defaultTheme;
      setThemeState(initial);
      applyThemeClass(initial);
    } catch {
      applyThemeClass(defaultTheme);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
        applyThemeClass(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [defaultTheme]);

  const setTheme = useCallback((next: DoiceladevTheme) => {
    setThemeState(next);
    applyThemeClass(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Silencioso en modos de privacidad estrictos
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme: theme, setTheme }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
