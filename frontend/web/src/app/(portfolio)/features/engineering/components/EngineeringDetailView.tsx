'use client';

import React, { useState, useMemo } from 'react';
import { Cpu, RefreshCw, Server, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type {
  EngineeringDomainType,
  PortfolioEngineeringPillar,
} from '../types';

interface EngineeringDetailViewProps {
  pillars: PortfolioEngineeringPillar[];
}

const DOMAIN_ORDER: EngineeringDomainType[] = ['cloud', 'security', 'systems', 'ai'];

const DOMAIN_ICONS: Record<
  EngineeringDomainType,
  React.ComponentType<{ className?: string }>
> = {
  cloud: Server,
  security: Shield,
  systems: RefreshCw,
  ai: Cpu,
};

export function EngineeringDetailView({
  pillars,
}: EngineeringDetailViewProps) {
  const t = useTranslations('Engineering');
  const [activeDomain, setActiveDomain] = useState<'all' | EngineeringDomainType>('all');

  const domainLabels: Record<EngineeringDomainType, string> = {
    cloud: t('domainCloud'),
    security: t('domainSecurity'),
    systems: t('domainSystems'),
    ai: t('domainAi'),
  };

  const filteredPillars = useMemo(() => {
    if (activeDomain === 'all') return pillars;
    return pillars.filter((p) => p.domain === activeDomain);
  }, [activeDomain, pillars]);

  return (
    <div className="flex flex-col gap-10">
      {/* Filtros por Dominio de Ingeniería */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveDomain('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeDomain === 'all'
              ? 'bg-surface border border-gold-300/80 text-foreground font-semibold shadow-sm'
              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5 border border-border/40'
          }`}
        >
          {t('filterAll')}
        </button>

        {DOMAIN_ORDER.map((dom) => (
          <button
            key={dom}
            type="button"
            onClick={() => setActiveDomain(dom)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeDomain === dom
                ? 'bg-surface border border-gold-300/80 text-foreground font-semibold shadow-sm'
                : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5 border border-border/40'
            }`}
          >
            {domainLabels[dom]}
          </button>
        ))}
      </div>

      {/* Pilares de Ingeniería Detallados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {filteredPillars.map((pillar) => {
          const Icon = DOMAIN_ICONS[pillar.domain] ?? Server;
          return (
            <article
              key={pillar.id}
              className="p-6 sm:p-7 rounded-xl border border-border/60 bg-surface/40 flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-gold-400 shrink-0" />
                    <h3 className="text-base font-mono text-foreground font-semibold">
                      {pillar.title}
                    </h3>
                  </div>
                  {pillar.badge && (
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gold-400/90 shrink-0">
                      {pillar.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-foreground/85 font-light leading-relaxed">
                  {pillar.summary}
                </p>

                {pillar.details && pillar.details.length > 0 && (
                  <ul className="space-y-2.5 pt-1">
                    {pillar.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-muted font-light leading-relaxed"
                      >
                        <span className="text-gold-400/80 font-mono text-[10px] mt-0.5 shrink-0">
                          0{idx + 1}
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-4 pt-1">
                {pillar.metrics && pillar.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {pillar.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono text-muted truncate">
                          {metric.label}
                        </span>
                        <span className="text-xs font-mono text-gold-300 font-semibold">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {pillar.technologies && pillar.technologies.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-foreground/75">
                    {pillar.technologies.map((tech, tIdx) => (
                      <React.Fragment key={tIdx}>
                        {tIdx > 0 && <span className="text-gold-400/50 select-none">•</span>}
                        <span>{tech}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
