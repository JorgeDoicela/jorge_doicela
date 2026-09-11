'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Componente ThemeToggle aislado para la Landing Page principal (jorgedoicela.com).
 * Proporciona alternancia fluida entre Modo Oscuro (Apple Slate / Cosmos) y Modo Claro (Apple Impoluto).
 */
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center opacity-50 pointer-events-none ${className}`}
        aria-hidden="true"
      >
        <span className="w-3.5 h-3.5 rounded-full border border-current border-dashed" />
      </div>
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-1.5 sm:p-2 rounded-md text-text-muted hover:text-foreground hover:bg-foreground/5 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center outline-none focus:outline-none select-none ${className}`}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      id="landing-theme-toggle"
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-400 hover:text-amber-300 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-indigo-600 hover:text-indigo-500 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
