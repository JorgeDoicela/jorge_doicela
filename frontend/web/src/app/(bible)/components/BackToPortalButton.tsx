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
      className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
      title={t('portal')}
      aria-label={t('portal')}
      id="bible-back-to-portal"
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
      <span className="font-mono text-[11px] tracking-tight">{t('portalShort')}</span>
    </a>
  );
}
