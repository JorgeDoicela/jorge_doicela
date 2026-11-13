'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { DoiceladevHeaderNav } from '../../doiceladev-header/ui/DoiceladevHeaderNav';
import { DoiceladevFooter } from '../../doiceladev-footer/ui/DoiceladevFooter';
import { DoiceladevSection } from '../../category-nav/ui/CategoryNav';
import { ThemeToggle } from '../../../features/theme-toggle/ui/ThemeToggle';
import { LanguageToggle } from '../../../features/language-toggle/ui/LanguageToggle';

export interface DoiceladevPageLayoutProps {
  activeCategory?: DoiceladevSection;
  backHref?: string;
  backLabel?: string;
  compact?: boolean;
  minimal?: boolean;
  onOpenSpotlight?: () => void;
  className?: string;
  children: React.ReactNode;
}


/**
 * Shell maestro unificado para todas las pantallas de DoicelaDev.
 * Garantiza consistencia en modo claro (Titanio) y oscuro (Obsidiana),
 * suministrando navegación, alternancia de tema, buscador, idioma y footer,
 * o un modo minimalista centrado para páginas transaccionales.
 */
export function DoiceladevPageLayout({
  activeCategory = 'all',
  backHref,
  backLabel,
  compact = false,
  minimal = false,
  onOpenSpotlight,
  className = '',
  children,
}: DoiceladevPageLayoutProps) {
  const tNav = useTranslations('Nav');

  if (minimal) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-colors duration-400">
        <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 sm:gap-3.5 select-none hover:opacity-90 transition-opacity"
          >
            <div className="h-[42px] sm:h-[48px] w-auto flex items-center justify-center shrink-0">
              <Image
                src="/doiceladev/logo/logo_blanco.webp"
                alt={tNav('headerLogoAlt')}
                width={128}
                height={128}
                className="h-full w-auto object-contain hidden dark:block"
                unoptimized
                priority
              />
              <Image
                src="/doiceladev/logo/logo_negro.webp"
                alt={tNav('headerLogoAlt')}
                width={128}
                height={128}
                className="h-full w-auto object-contain block dark:hidden"
                unoptimized
                priority
              />
            </div>
            <div className="h-7 sm:h-8 w-auto flex items-center justify-center translate-y-[2px]">
              <Image
                src="/doiceladev/logo/doiceladev.webp"
                alt={tNav('headerLogoAlt')}
                width={380}
                height={105}
                className="h-full w-auto object-contain filter invert dark:filter-none contrast-125 transition-all duration-300"
                unoptimized
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full glass-convex-panel scale-95 origin-right">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>

        <main className={`flex-1 w-full flex items-center justify-center px-4 sm:px-6 py-10 ${className}`}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
      <div className={`w-full max-w-[1490px] 2xl:max-w-[1620px] px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10 flex-1 pb-16 md:pb-24 ${className}`}>
        {/* Cabecera Editorial Reutilizable */}
        <DoiceladevHeaderNav
          activeCategory={activeCategory}
          backHref={backHref}
          backLabel={backLabel}
          compact={compact}
          onOpenSpotlight={onOpenSpotlight}
        />

        {/* Contenido Dinámico de la Pantalla */}
        {children}
      </div>

      {/* Pie de Página Unificado */}
      <DoiceladevFooter />
    </div>
  );
}

