'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Sun, Moon, BookOpen } from 'lucide-react';

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
      <div className="w-8 h-8 rounded-full bg-transparent" />
    );
  }

  const currentTheme = theme === 'system' ? (resolvedTheme || 'light') : (theme || 'light');

  const cycleTheme = () => {
    if (currentTheme === 'light') {
      setTheme('sepia');
    } else if (currentTheme === 'sepia') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const getThemeLabel = () => {
    if (currentTheme === 'sepia') return t('themeSepia');
    if (currentTheme === 'dark') return t('themeDark');
    return t('themeLight');
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1 transition-colors duration-150 cursor-pointer active:scale-95 focus-visible:ring-1 focus-visible:ring-foreground focus:outline-none"
      aria-label={`${t('changeTheme')} - ${getThemeLabel()}`}
      title={`${t('changeTheme')} (${getThemeLabel()})`}
    >
      {currentTheme === 'dark' ? (
        <Moon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
      ) : currentTheme === 'sepia' ? (
        <BookOpen className="w-4 h-4 shrink-0" strokeWidth={1.75} />
      ) : (
        <Sun className="w-4 h-4 shrink-0" strokeWidth={1.75} />
      )}
    </button>
  );
}
