'use client';

import React, { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es';
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = nextLocale;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono tracking-wider uppercase text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-150 cursor-pointer active:scale-95 disabled:opacity-50"
      aria-label={`Cambiar idioma (actual: ${locale})`}
    >
      <Globe className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200" />
      <span>{locale.toUpperCase()}</span>
    </button>
  );
}
