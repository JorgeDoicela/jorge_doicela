'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-gold-s hover:text-gold-p hover:bg-gold-b/20 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-p"
      aria-label="Cambiar tema"
      id="portfolio-theme-toggle"
    >
      {isDark ? (
        <Sun className="h-[15px] w-[15px]" strokeWidth={1.5} />
      ) : (
        <Moon className="h-[15px] w-[15px]" strokeWidth={1.5} />
      )}
    </button>
  );
}
