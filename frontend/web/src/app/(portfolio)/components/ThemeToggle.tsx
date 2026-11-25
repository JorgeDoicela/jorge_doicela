'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Sun, Moon } from 'lucide-react';

export interface ThemeToggleProps {
  className?: string;
  id?: string;
}

export function ThemeToggle({
  className = '',
  id,
}: ThemeToggleProps = {}) {
  const tNav = useTranslations('Nav');
  const { setTheme, resolvedTheme } = useTheme();

  const handleToggle = () => {
    const isDark =
      resolvedTheme === 'dark' ||
      document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`group p-1.5 sm:p-2 rounded-md hover:bg-gold-300/10 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center outline-none focus:outline-none select-none ${className}`}
      aria-label={tNav('toggleTheme')}
      title={tNav('toggleTheme')}
      id={id}
    >
      <Sun
        className="hidden dark:block w-3.5 h-3.5 text-gold-300 group-hover:text-gold-100 transition-all duration-300 group-hover:rotate-45"
        aria-hidden="true"
      />
      <Moon
        className="block dark:hidden w-3.5 h-3.5 text-gold-400 group-hover:text-gold-200 transition-all duration-300 group-hover:-rotate-12"
        aria-hidden="true"
      />
    </button>
  );
}
