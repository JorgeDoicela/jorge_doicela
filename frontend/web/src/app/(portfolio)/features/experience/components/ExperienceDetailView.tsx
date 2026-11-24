'use client';

import React from 'react';
import { ArrowUpRight, Briefcase, GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PortfolioExperienceItem } from '../types';

interface ExperienceDetailViewProps {
  items: PortfolioExperienceItem[];
}

export function ExperienceDetailView({ items }: ExperienceDetailViewProps) {
  const tExp = useTranslations('Experience');

  const workItems = items.filter((item) => item.type === 'work');
  const eduItems = items.filter((item) => item.type === 'education');

  return (
    <div className="flex flex-col gap-16">
      {/* Trayectoria Laboral Detallada */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2.5 border-b border-border/40 pb-4">
          <Briefcase className="w-4 h-4 text-gold-400" />
          <h2 className="text-xl md:text-2xl font-light text-foreground">
            {tExp('title')}
          </h2>
        </div>

        <div className="space-y-10">
          {workItems.map((item, idx) => (
            <article
              key={item.id}
              className="border-l border-border-gold pl-5 sm:pl-7 relative"
            >
              <div
                className={`absolute w-2.5 h-2.5 rounded-full -left-[5.5px] top-1.5 ${
                  idx === 0 ? 'bg-gold-400 luxury-pulse' : 'bg-gold-500/80'
                }`}
              />

              <div className="p-6 sm:p-7 rounded-xl border border-border/60 bg-surface/40 flex flex-col gap-5">
                {/* Cabecera del Cargo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/30 pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base sm:text-lg font-mono text-foreground font-semibold">
                      {item.title}
                    </h3>
                    {item.companyUrl && (
                      <a
                        href={item.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border-gold/40 bg-background/50 text-[10px] font-mono text-gold-400 hover:text-gold-200 hover:border-gold-300/60 transition-colors"
                      >
                        <span>{item.companyUrl.replace(/^https?:\/\//, '')}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
                    <span className={idx === 0 ? 'text-gold-400 font-semibold' : 'text-foreground/75'}>
                      {item.subtitle}
                    </span>
                    {item.period && (
                      <>
                        <span className="text-border-gold">•</span>
                        <span className="text-muted">{item.period}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Descripción General */}
                <p className="text-xs sm:text-sm text-foreground/85 font-light leading-relaxed">
                  {item.description}
                </p>

                {/* Responsabilidades y Logros */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400/90 block">
                      {tExp('highlightsLabel')}
                    </span>
                    <ul className="space-y-2">
                      {item.highlights.map((highlight, hIdx) => (
                        <li
                          key={hIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-muted font-light leading-relaxed"
                        >
                          <span className="text-gold-400/70 font-mono text-[10px] mt-1 shrink-0">
                            0{hIdx + 1}
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stack Tecnológico Empleado */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="pt-2 border-t border-border/30 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-foreground/75">
                    <span className="text-[10px] uppercase tracking-wider text-muted mr-1">
                      {tExp('stackUsedLabel')}:
                    </span>
                    {item.technologies.map((tech, tIdx) => (
                      <React.Fragment key={tIdx}>
                        {tIdx > 0 && <span className="text-gold-400/50 select-none">•</span>}
                        <span>{tech}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Formación Académica Detallada */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2.5 border-b border-border/40 pb-4">
          <GraduationCap className="w-4 h-4 text-gold-400" />
          <h2 className="text-xl md:text-2xl font-light text-foreground">
            {tExp('eduTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eduItems.map((edu, idx) => (
            <article
              key={edu.id}
              className="p-6 rounded-xl border border-border/60 bg-surface/40 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-mono text-foreground font-semibold leading-snug">
                    {edu.title}
                  </h3>
                  {edu.period && (
                    <span
                      className={`text-[10px] font-mono uppercase shrink-0 ${
                        idx === 0 ? 'text-gold-400' : 'text-muted'
                      }`}
                    >
                      {edu.period}
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-mono text-gold-300/90">
                  {edu.subtitle}
                </p>

                <p className="text-xs text-muted font-light leading-relaxed">
                  {edu.description}
                </p>

                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="space-y-1.5 pt-2">
                    {edu.highlights.map((h, hIdx) => (
                      <li
                        key={hIdx}
                        className="flex items-start gap-2 text-xs text-foreground/75 font-light"
                      >
                        <span className="text-gold-400/60 select-none">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {edu.technologies && edu.technologies.length > 0 && (
                <div className="pt-3 border-t border-border/30 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-foreground/70">
                  {edu.technologies.map((tech, tIdx) => (
                    <React.Fragment key={tIdx}>
                      {tIdx > 0 && <span className="text-gold-400/50 select-none">•</span>}
                      <span>{tech}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
