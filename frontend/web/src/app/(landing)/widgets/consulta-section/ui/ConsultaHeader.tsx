'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '../../../features/theme-toggle';
import QuitoClockBadge from '../../../shared/ui/QuitoClockBadge';
import LanguageToggleButton from '../../../features/language-toggle';

export function ConsultaHeader() {
  const t = useTranslations('Consulta');
  const tCommon = useTranslations('Common');

  return (
    <header
      className="animate-fade-in-up fixed top-5 left-5 right-5 sm:top-6 sm:left-8 sm:right-8 md:top-7 md:left-10 md:right-10 z-50 flex items-center justify-between pointer-events-none"
      style={{ animationDelay: '0ms' }}
    >
      {/* Controles Izquierda */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Jorge Doicela - Inicio"
        >
          {/* Logo Blanco (Modo Oscuro) */}
          <Image
            src="/landing/logo/logo_blanco.png"
            alt="Jorge Doicela"
            width={28}
            height={28}
            className="h-5 sm:h-6 w-auto object-contain hidden dark:block"
            priority
          />
          {/* Logo Negro (Modo Claro) */}
          <Image
            src="/landing/logo/logo_negro.png"
            alt="Jorge Doicela"
            width={28}
            height={28}
            className="h-5 sm:h-6 w-auto object-contain block dark:hidden"
            priority
          />
        </Link>

        <div className="w-px h-3.5 bg-card-border/60 mx-0.5" aria-hidden="true" />

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-foreground/5 cursor-pointer active:scale-95"
          aria-label={t('backHome')}
        >
          <span>←</span>
          <span className="hidden sm:inline">{t('backHome')}</span>
          <span className="inline sm:hidden">{tCommon('back')}</span>
        </Link>
      </div>

      {/* Controles Derecha */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <QuitoClockBadge />

        <div className="hidden sm:block w-px h-3.5 bg-card-border/60 mx-0.5" aria-hidden="true" />

        <LanguageToggleButton />

        <ThemeToggle />
      </div>
    </header>
  );
}


