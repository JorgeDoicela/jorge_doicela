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
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono tracking-wider uppercase border border-accents-2 bg-background hover:bg-accents-1 text-accents-7 hover:text-foreground transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50"
      aria-label={`Cambiar idioma (actual: ${locale})`}
    >
      <Globe className="w-3.5 h-3.5 text-accents-5" />
      <span>{locale.toUpperCase()}</span>
    </button>
  );
}
