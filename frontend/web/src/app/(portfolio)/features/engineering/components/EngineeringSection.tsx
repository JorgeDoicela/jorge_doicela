'use client';

import React from 'react';
import { ArrowRight, Cpu, RefreshCw, Server, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PortfolioLink } from '../../../shared';
import type { EngineeringDomainType, PortfolioEngineeringPillar } from '../types';

interface EngineeringSectionProps {
  pillars: PortfolioEngineeringPillar[];
  viewAllHref?: string;
}

const DOMAIN_ICONS: Record<
  EngineeringDomainType,
  React.ComponentType<{ className?: string }>
> = {
  cloud: Server,
  systems: RefreshCw,
  security: Shield,
  ai: Cpu,
};

export function EngineeringSection({
  pillars,
  viewAllHref = '/engineering',
}: EngineeringSectionProps) {
  const t = useTranslations('Engineering');

  return (
    <section id="engineering" className="flex flex-col gap-6 scroll-mt-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-light text-foreground">
          {t('title')}
        </h2>

        {viewAllHref && (
          <PortfolioLink
            href={viewAllHref}
            className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-gold-400 hover:text-gold-200 transition-colors shrink-0"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </PortfolioLink>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
        {pillars.slice(0, 3).map((pillar, idx) => {
          const Icon = DOMAIN_ICONS[pillar.domain] ?? Server;
          return (
            <div
              key={pillar.id}
              className={`flex flex-col gap-2.5 ${
                idx === 1 ? 'md:px-4 md:border-x border-border/40' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4.5 h-4.5 text-gold-400 shrink-0" />
                <h3 className="text-xs font-mono font-semibold text-foreground">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-muted text-xs leading-relaxed font-light">
                {pillar.summary}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
