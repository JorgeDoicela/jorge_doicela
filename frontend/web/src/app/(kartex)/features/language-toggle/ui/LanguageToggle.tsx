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
      className="flex items-center gap-1.5 px-2.5 py-1 h-8 rounded-full bg-transparent text-xs font-mono tracking-wider uppercase text-accents-5 hover:text-foreground hover:bg-accents-1 transition-colors duration-150 cursor-pointer active:scale-95 disabled:opacity-50"
      aria-label={`Cambiar idioma (actual: ${locale})`}
      title={`Cambiar idioma (actual: ${locale.toUpperCase()})`}
    >
      <Globe className="w-4 h-4 shrink-0" strokeWidth={1.75} />
      <span>{locale.toUpperCase()}</span>
    </button>
  );
}
