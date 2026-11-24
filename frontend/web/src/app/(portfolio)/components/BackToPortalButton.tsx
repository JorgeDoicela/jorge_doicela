'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isPortfolioHomePath, getPortfolioHomeHref } from '../shared';

export interface BackToPortalButtonProps {
  className?: string;
  id?: string;
  showArrow?: boolean;
  arrowClassName?: string;
}

export function BackToPortalButton({
  className = '',
  id = 'portfolio-back-to-portal',
  showArrow = true,
  arrowClassName = '',
}: BackToPortalButtonProps = {}) {
  const pathname = usePathname();
  const t = useTranslations('Nav');
  const [portalUrl, setPortalUrl] = useState('https://jorgedoicela.com');

  const isHome = isPortfolioHomePath(pathname);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
      const port = window.location.port ? `:${window.location.port}` : '';
      const protocol = window.location.protocol;
      setPortalUrl(isLocal ? `${protocol}//localhost${port}` : 'https://jorgedoicela.com');
    }
  }, []);

  const sharedClasses = `group inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono tracking-wider uppercase text-foreground/70 hover:text-gold-200 hover:bg-foreground/5 active:scale-95 transition-all duration-200 cursor-pointer select-none outline-none focus:outline-none ${className}`;

  const arrowEl = showArrow ? (
    <ArrowLeft
      className={`w-3.5 h-3.5 text-gold-300 transition-transform duration-200 group-hover:-translate-x-0.5 ${arrowClassName}`}
    />
  ) : null;

  // En subpáginas (/about, /projects, /stack, /experience, /engineering, /terminal) vuelve al inicio del portafolio
  if (!isHome) {
    return (
      <Link
        href={getPortfolioHomeHref(pathname)}
        className={sharedClasses}
        title={t('landing')}
        aria-label={t('landing')}
        id={id}
      >
        {arrowEl}
        <span>{t('landing')}</span>
      </Link>
    );
  }

  // En el Home del portafolio (/) regresa al portal principal (jorgedoicela.com)
  return (
    <a
      href={portalUrl}
      className={sharedClasses}
      title={t('portal')}
      aria-label={t('portal')}
      id={id}
    >
      {arrowEl}
      <span>{t('portalShort')}</span>
    </a>
  );
}
