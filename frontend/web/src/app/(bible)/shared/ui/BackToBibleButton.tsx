'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BackToBibleButton() {
  const t = useTranslations('Nav');
  const [homeUrl, setHomeUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      // Si estamos en el subdominio bible.* (ej. bible.localhost o bible.jorgedoicela.com), la raíz es '/'
      // Si estamos en ruta directa sin subdominio (ej. localhost:3001/bible/...), la raíz es '/bible'
      const isBibleSubdomain = hostname.startsWith('bible.');
      setHomeUrl(isBibleSubdomain ? '/' : '/bible');
    }
  }, []);

  return (
    <Link
      href={homeUrl}
      className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
      title={t('backToBible')}
      aria-label={t('backToBible')}
      id="bible-back-to-home"
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
      <span className="font-mono text-[11px] tracking-tight">{t('back')}</span>
    </Link>
  );
}
