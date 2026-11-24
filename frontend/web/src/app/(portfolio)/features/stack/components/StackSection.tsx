'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PortfolioStackItem, StackCategoryType } from '../types';

interface StackSectionProps {
  items: PortfolioStackItem[];
  viewAllHref?: string;
}

const HOME_COLUMNS: { category: StackCategoryType; titleKey: 'client' | 'server' | 'data' }[] = [
  { category: 'frontend', titleKey: 'client' },
  { category: 'backend', titleKey: 'server' },
  { category: 'data_devops', titleKey: 'data' },
];

/**
 * StackSection (Home)
 * Preserva las 3 columnas editoriales con cinta infinita fluida por categoría
 * alimentada desde portfolio.sqlite, con enlace a la página dedicada /stack.
 */
export function StackSection({
  items,
  viewAllHref = '/stack',
}: StackSectionProps) {
  const t = useTranslations('Stack');

  const renderSkillsTrack = (sectionItems: PortfolioStackItem[], prefix: string) => (
    <div className="flex items-center gap-2 pr-2 shrink-0">
      {sectionItems.map((item) => (
        <React.Fragment key={`${prefix}-${item.id}`}>
          <span className="text-xs font-mono text-foreground/80 hover:text-gold-200 transition-colors whitespace-nowrap">
            {item.name}
          </span>
          <span className="text-gold-400/50 select-none">•</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section id="stack" className="flex flex-col gap-6 scroll-mt-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-light text-foreground">
          {t('title')}
        </h2>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-gold-400 hover:text-gold-200 transition-colors shrink-0"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
        {HOME_COLUMNS.map((col) => {
          const sectionItems = items.filter((i) => i.category === col.category);
          if (sectionItems.length === 0) return null;

          return (
            <div key={col.category} className="flex flex-col gap-2.5 min-w-0">
              <span className="text-[11px] font-mono text-gold-400 tracking-wider uppercase">
                {t(col.titleKey)}
              </span>

              <div
                className="marquee-track overflow-hidden flex select-none py-0.5"
                style={{
                  maskImage:
                    'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                }}
              >
                <div className="flex w-max animate-portfolio-marquee-left">
                  {renderSkillsTrack(sectionItems, `${col.category}-a`)}
                  {renderSkillsTrack(sectionItems, `${col.category}-b`)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
