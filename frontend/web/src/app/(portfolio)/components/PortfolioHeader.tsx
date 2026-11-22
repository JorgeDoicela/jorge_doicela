'use client';

import React from 'react';
import { BackToPortalButton } from './BackToPortalButton';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { usePortfolioHeaderScroll } from '../hooks/usePortfolioHeaderScroll';

export function PortfolioHeader() {
  const isVisible = usePortfolioHeaderScroll();

  return (
    <header
      aria-hidden={!isVisible}
      className={`fixed top-5 left-5 right-5 sm:top-6 sm:left-8 sm:right-8 md:top-7 md:left-10 md:right-10 z-50 flex items-center justify-between pointer-events-none transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity,filter] ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100 blur-none'
          : '-translate-y-12 sm:-translate-y-14 opacity-0 scale-[0.98] blur-[4px] pointer-events-none'
      }`}
    >
      <div className={`flex items-center gap-1.5 sm:gap-2.5 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <BackToPortalButton />
      </div>

      <div className={`flex items-center gap-2 sm:gap-3 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
