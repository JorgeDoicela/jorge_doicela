'use client';

import React, { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LanguageToggle() {
  const locale = useLocale();
  const tNav = useTranslations('Nav');
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
      type="button"
      onClick={toggleLanguage}
      disabled={isPending}
      className="px-2 py-1 rounded-md text-foreground/70 hover:text-foreground hover:bg-foreground/5 active:scale-95 transition-colors duration-200 cursor-pointer text-xs font-medium tracking-tight outline-none focus:outline-none disabled:opacity-50 select-none"
      aria-label={`${tNav('toggleLang')} (${locale.toUpperCase()})`}
    >
      <span>{locale.toUpperCase()}</span>
    </button>
  );
}
