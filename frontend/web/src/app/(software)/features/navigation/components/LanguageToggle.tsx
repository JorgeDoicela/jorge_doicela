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
      className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-sans font-medium text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150 cursor-pointer disabled:opacity-50"
      aria-label={`Cambiar idioma (actual: ${locale})`}
    >
      <Globe className="w-3.5 h-3.5" />
      <span className="font-mono uppercase text-[11px]">{locale}</span>
    </button>
  );
}
