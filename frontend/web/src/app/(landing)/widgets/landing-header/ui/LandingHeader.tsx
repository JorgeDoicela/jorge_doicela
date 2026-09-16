'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { QuitoClockBadge } from '../../../shared';
import { LanguageToggleButton } from '../../../features/language-toggle';
import { ThemeToggle } from '../../../features/theme-toggle';

export interface LandingHeaderProps {
  sectionBadge?: string;
  showBackLink?: boolean;
  backLabel?: string;
  backHref?: string;
  logoHref?: string;
  className?: string;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  sectionBadge,
  showBackLink = false,
  backLabel,
  backHref = '/',
  logoHref,
  className = '',
}) => {
  const targetHref = logoHref || (sectionBadge || showBackLink ? backHref : '#');

  return (
    <header
      className={`animate-fade-in-up fixed top-5 left-5 right-5 sm:top-6 sm:left-8 sm:right-8 md:top-7 md:left-10 md:right-10 z-50 flex items-center justify-between pointer-events-none ${className}`.trim()}
      style={{ animationDelay: '0ms' }}
    >
      {/* Controles Izquierda: Logotipo y Sección Opcional */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5">
        <Link
          href={targetHref}
          className="flex items-center gap-2 outline-none focus:outline-none hover:opacity-80 active:scale-95 transition-all duration-200 cursor-pointer"
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

        {showBackLink && (
          <>
            <div className="w-px h-3.5 bg-card-border/60 mx-0.5" aria-hidden="true" />
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-foreground/5 cursor-pointer active:scale-95"
              aria-label={backLabel || 'Volver'}
            >
              <span>←</span>
              <span>{backLabel || 'Inicio'}</span>
            </Link>
          </>
        )}

        {sectionBadge && (
          <>
            <span className="text-card-border select-none" aria-hidden="true">/</span>
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">
              {sectionBadge}
            </span>
          </>
        )}
      </div>

      {/* Controles Derecha: Reloj de Quito, Selector de Idioma y Modo Claro/Oscuro */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <QuitoClockBadge />
        <div className="hidden sm:block w-px h-3.5 bg-card-border/60 mx-0.5" aria-hidden="true" />
        <LanguageToggleButton />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default LandingHeader;
