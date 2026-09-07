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
      className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase border border-border bg-card/60 hover:bg-card hover:border-gold-300/40 text-foreground hover:text-gold-200 transition-all duration-200 cursor-pointer active:scale-95 shadow-xs select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-300/60"
      title={t('portal')}
      aria-label={t('portal')}
      id="portfolio-back-to-portal"
    >
      <ArrowLeft className="w-3.5 h-3.5 text-gold-300 transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span className="hidden sm:inline">{t('portalShort')}</span>
    </a>
  );
}
