'use client';

import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PortfolioLink } from '../../../shared';
import type { PortfolioExperienceItem } from '../types';

interface ExperienceSectionProps {
  items: PortfolioExperienceItem[];
  viewAllHref?: string;
}

export function ExperienceSection({
  items,
  viewAllHref = '/experience',
}: ExperienceSectionProps) {
  const tExp = useTranslations('Experience');

  const workItems = items.filter((item) => item.type === 'work');
  const eduItems = items.filter((item) => item.type === 'education');

  return (
    <section
      id="experience"
      className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start scroll-mt-24"
    >
      {/* Experiencia Laboral (2 columnas) */}
      <div className="md:col-span-2 flex flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4 mb-2">
          <h2 className="text-2xl font-light text-foreground">
            {tExp('title')}
          </h2>

          {viewAllHref && (
            <PortfolioLink
              href={viewAllHref}
              className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-gold-400 hover:text-gold-200 transition-colors shrink-0"
            >
              <span>{tExp('viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </PortfolioLink>
          )}
        </div>

        <div className="space-y-8">
          {workItems.map((item, idx) => (
            <div key={item.id} className="border-l border-border-gold pl-4 relative">
              <div
                className={`absolute w-2 h-2 rounded-full -left-[5px] top-1.5 ${
                  idx === 0 ? 'bg-gold-400 luxury-pulse' : 'bg-gold-500'
                }`}
              />
              <div className="flex flex-wrap justify-between items-start gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-mono text-foreground font-semibold">
                    {item.title}
                  </h3>
                  {item.companyUrl && (
                    <a
                      href={item.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[10px] font-mono text-gold-400 hover:text-gold-200 transition-colors"
                    >
                      <span>{item.companyUrl.replace(/^https?:\/\//, '')}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <span
                  className={`text-[10px] font-mono uppercase ${
                    idx === 0 ? 'text-gold-400' : 'text-muted'
                  }`}
                >
                  {item.subtitle}
                  {idx === 0 && item.period ? ` • ${item.period}` : ''}
                </span>
              </div>
              <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Formación Académica (1 columna) */}
      <div className="flex flex-col gap-6 md:pl-6 md:border-l border-border/40 h-full justify-between">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-light text-foreground mb-2">
            {tExp('eduTitle')}
          </h2>

          <div className="space-y-5">
            {eduItems.map((edu, idx) => (
              <div
                key={edu.id}
                className={idx > 0 ? 'border-t border-border/30 pt-4' : ''}
              >
                <h3 className="text-xs md:text-sm font-mono text-foreground font-semibold">
                  {edu.title}
                </h3>
                <p
                  className={`text-[10px] font-mono mt-1 ${
                    idx === 0 ? 'text-gold-400' : 'text-muted'
                  }`}
                >
                  {edu.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
