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
      className="group inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium text-accents-5 hover:text-foreground hover:bg-accents-1 border border-accents-2 transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
      title={t('portal')}
      aria-label={t('portal')}
      id="bible-back-to-portal"
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5 text-accents-4 group-hover:text-foreground" />
      <span className="font-mono text-[11px] tracking-tight">{t('portalShort')}</span>
    </a>
  );
}
