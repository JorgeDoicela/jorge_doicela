import React from 'react';
import { PortfolioHeader } from './PortfolioHeader';
import { PortfolioFooter } from './PortfolioFooter';

export const PORTFOLIO_CONTAINER_CLASS = 'w-full max-w-[1380px] mx-auto';

interface PortfolioPageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function PortfolioPageShell({
  children,
  title,
  subtitle,
}: PortfolioPageShellProps) {
  return (
    <div className="portfolio-shell min-h-screen bg-background text-foreground pt-16 md:pt-11 pb-10 md:pb-12 px-4 sm:px-6 md:px-10 lg:px-12 relative selection:bg-[rgba(197,168,122,0.18)] selection:text-gold-100 transition-colors duration-300">
      <PortfolioHeader />

      {title ? (
        <main className={`${PORTFOLIO_CONTAINER_CLASS} flex flex-col gap-12 animate-fade-up`}>
          <div className="flex flex-col gap-3 pb-2">
            <h1 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted text-xs md:text-sm font-light max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </main>
      ) : (
        children
      )}

      <PortfolioFooter />
    </div>
  );
}
