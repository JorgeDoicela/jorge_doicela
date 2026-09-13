'use client';

import React, { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations('Common');
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
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer shrink-0 select-none disabled:opacity-50"
      title={t('switchLang', { locale })}
      aria-label={t('switchLang', { locale })}
    >
      <span className="font-mono uppercase font-bold text-[11px] sm:text-xs tracking-wider">
        {locale}
      </span>
    </button>
  );
}
