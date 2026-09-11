'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 opacity-60 pointer-events-none"
        aria-hidden="true"
      >
        <span className="w-4 h-4 rounded-full border border-current border-dashed" />
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
      className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer shrink-0"
      title={isDark ? 'Cambiar a modo claro (Titanio)' : 'Cambiar a modo oscuro (Obsidiana)'}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 hover:text-indigo-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
