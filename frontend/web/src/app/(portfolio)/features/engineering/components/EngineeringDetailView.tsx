'use client';

import React, { useState, useMemo } from 'react';
import { Activity, Cpu, RefreshCw, Server, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type {
  EngineeringDomainType,
  PortfolioEngineeringPillar,
  ServerTelemetrySnapshot,
} from '../types';

interface EngineeringDetailViewProps {
  pillars: PortfolioEngineeringPillar[];
  telemetry: ServerTelemetrySnapshot | null;
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

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m ${seconds % 60}s`;
}

export function EngineeringDetailView({
  pillars,
  telemetry,
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
    <div className="flex flex-col gap-12">
      {/* Telemetría Real en Vivo del Backend */}
      {telemetry && (
        <section className="p-5 sm:p-6 rounded-xl border border-border-gold/50 bg-surface/50 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-gold-300 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-gold-400" />
              <span>{t('telemetryTitle')}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-gold-400">
              <span className="w-2 h-2 rounded-full bg-gold-400 luxury-pulse" />
              <span>{t('telemetryOperational')}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted uppercase">{t('telemetryRuntime')}</span>
              <span className="text-foreground/90">{telemetry.runtime}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted uppercase">{t('telemetryMemory')}</span>
              <span className="text-foreground/90">{telemetry.memoryRssMb} MB RSS</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted uppercase">{t('telemetryUptime')}</span>
              <span className="text-foreground/90">{formatUptime(telemetry.uptimeSeconds)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted uppercase">{t('telemetryPlatform')}</span>
              <span className="text-foreground/90 uppercase">{telemetry.platform} / {telemetry.arch}</span>
            </div>
          </div>
        </section>
      )}

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
                <div className="flex items-start justify-between gap-3 border-b border-border/30 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-surface-raised border border-border/50 text-gold-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-mono text-foreground font-semibold">
                      {pillar.title}
                    </h3>
                  </div>
                  {pillar.badge && (
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-border-gold/40 text-gold-400 shrink-0">
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

              <div className="flex flex-col gap-4 pt-4 border-t border-border/30">
                {pillar.metrics && pillar.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {pillar.metrics.map((metric, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-2.5 rounded-lg bg-background/50 border border-border/40 flex flex-col gap-0.5"
                      >
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
