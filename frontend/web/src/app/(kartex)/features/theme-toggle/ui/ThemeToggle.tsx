'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const t = useTranslations('Nav');

  // Evitar hydration mismatch renderizando el botón vacío en el servidor
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-transparent" />
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1 transition-all duration-150 cursor-pointer focus-visible:ring-1 focus-visible:ring-foreground focus:outline-none"
      aria-label={t('changeTheme')}
      title={t('changeTheme')}
    >
      {isDark ? (
        <Sun className="h-[15px] w-[15px]" strokeWidth={1.5} />
      ) : (
        <Moon className="h-[15px] w-[15px]" strokeWidth={1.5} />
      )}
    </button>
  );
}
