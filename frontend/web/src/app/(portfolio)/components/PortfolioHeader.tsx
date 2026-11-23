'use client';

import React from 'react';
import { BackToPortalButton } from './BackToPortalButton';
import { PortfolioPreferences } from './PortfolioPreferences';
import { usePortfolioHeaderScroll } from '../hooks/usePortfolioHeaderScroll';

export function PortfolioHeader() {
  const isVisible = usePortfolioHeaderScroll();

  return (
    <header
      aria-hidden={!isVisible}
      className={`portfolio-shell-header fixed top-5 inset-x-0 sm:top-6 md:top-7 z-30 px-4 sm:px-6 md:px-10 lg:px-12 pointer-events-none transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity,filter] ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100 blur-none'
          : '-translate-y-12 sm:-translate-y-14 opacity-0 scale-[0.98] blur-[4px] pointer-events-none'
      }`}
    >
      <div className="w-full max-w-[1420px] 2xl:max-w-[1540px] mx-auto flex items-center justify-between pointer-events-none">
        <div className={`flex items-center gap-1.5 sm:gap-2.5 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <BackToPortalButton id="portfolio-header-back-to-portal" className="-ml-2" />
        </div>

        <div className={`flex items-center gap-2 sm:gap-3 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <PortfolioPreferences prefixId="portfolio-header" className="-mr-1.5 sm:-mr-2" />
        </div>
      </div>
    </header>
  );
}
