'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { LandingFooterLinks } from './LandingFooterLinks';

export interface LandingFooterProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  variant = 'full',
  className = '',
}) => {
  const tCommon = useTranslations('Common');
  const currentYear = new Date().getFullYear().toString();

  if (variant === 'compact') {
    return (
      <footer className={`w-full text-center mt-8 mb-4 ${className}`.trim()}>
        <p className="text-xs font-medium text-text-muted">
          {tCommon('footer', { year: currentYear })}
        </p>
      </footer>
    );
  }

  return (
    <footer
      className={`animate-fade-in-up w-full max-w-5xl mt-16 border-t border-card-border/30 pt-8 pb-12 px-2 md:px-0 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtitle font-normal tracking-tight ${className}`.trim()}
      style={{ animationDelay: '800ms' }}
    >
      <span>{tCommon('footer', { year: currentYear })}</span>
      <LandingFooterLinks />
    </footer>
  );
};

export default LandingFooter;
