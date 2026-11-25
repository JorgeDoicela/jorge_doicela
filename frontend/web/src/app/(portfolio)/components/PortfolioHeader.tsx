'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BackToPortalButton } from './BackToPortalButton';
import { PortfolioPreferences } from './PortfolioPreferences';
import { usePortfolioHeaderScroll } from '../hooks/usePortfolioHeaderScroll';
import { usePortfolioNavigation } from '../features/navigation';

export function PortfolioHeader() {
  const isVisible = usePortfolioHeaderScroll();
  const tNav = useTranslations('SideNav');
  const { toggleMobile, isMobileOpen } = usePortfolioNavigation();

  return (
    <header
      aria-hidden={!isVisible}
      className={`portfolio-shell-header fixed top-5 inset-x-0 sm:top-6 md:top-7 z-30 px-4 sm:px-6 md:px-10 lg:px-12 pointer-events-none transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity,filter] ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100 blur-none'
          : '-translate-y-12 sm:-translate-y-14 opacity-0 scale-[0.98] blur-[4px] pointer-events-none'
      }`}
    >
      <div className="w-full max-w-[1380px] mx-auto flex items-center justify-between pointer-events-none">
        <div className={`flex items-center gap-1 sm:gap-2 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {/* Botón de 3 líneas a la izquierda (visible solo en móvil/tablet < lg) */}
          <button
            type="button"
            onClick={toggleMobile}
            aria-label={isMobileOpen ? tNav('closeMobile') : tNav('openMobile')}
            aria-expanded={isMobileOpen}
            className="lg:hidden p-1.5 rounded-md text-foreground/75 hover:text-gold-300 hover:bg-gold-300/10 active:scale-95 transition-all duration-200 cursor-pointer outline-none focus:outline-none -ml-1.5"
            id="portfolio-header-mobile-menu-trigger"
          >
            <Menu className="w-4 h-4 text-gold-300" />
          </button>

          {/* Palabra PORTAL: sin flecha en móvil (< lg) junto a las 3 líneas, con flecha clásica en PC (lg+) */}
          <BackToPortalButton
            id="portfolio-header-back-to-portal"
            arrowClassName="hidden lg:inline-block"
          />
        </div>

        <div className={`flex items-center gap-2 sm:gap-3 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <PortfolioPreferences prefixId="portfolio-header" className="-mr-1.5 sm:-mr-2" />
        </div>
      </div>
    </header>
  );
}
