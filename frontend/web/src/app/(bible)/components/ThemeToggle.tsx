'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evitar hydration mismatch renderizando el botón vacío en el servidor
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-md border border-border bg-transparent" />
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-transparent text-accents-5 hover:text-foreground hover:border-accents-5 transition-colors duration-200 cursor-pointer"
      aria-label="Cambiar tema"
    >
      {isDark ? (
        <Sun className="h-[14px] w-[14px]" />
      ) : (
        <Moon className="h-[14px] w-[14px]" />
      )}
    </button>
  );
}
