'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const tNav = useTranslations('Nav');
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-7 h-7 sm:w-8 sm:h-8" />;
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-1.5 sm:p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-foreground/5 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center outline-none focus:outline-none select-none"
      aria-label={tNav('toggleTheme')}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      id="portfolio-theme-toggle"
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-400 hover:text-amber-300 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-indigo-400 hover:text-indigo-300 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
