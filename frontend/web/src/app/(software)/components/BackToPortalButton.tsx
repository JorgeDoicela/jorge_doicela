'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BackToPortalButton() {
  const t = useTranslations('Nav');
  const [portalUrl, setPortalUrl] = useState('https://jorgedoicela.com');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
      const port = window.location.port ? `:${window.location.port}` : '';
      const protocol = window.location.protocol;
      setPortalUrl(isLocal ? `${protocol}//localhost${port}` : 'https://jorgedoicela.com');
    }
  }, []);

  return (
    <a
      href={portalUrl}
      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-medium text-zinc-600 dark:text-zinc-400 hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 shrink-0 cursor-pointer"
      title={t('portal')}
      aria-label={t('portal')}
      id="software-back-to-portal"
    >
      <ArrowLeft className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span className="tracking-tight font-medium">{t('portalShort')}</span>
    </a>
  );
}
