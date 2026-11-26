'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PortfolioLink } from '../../../shared';
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
 * Muestra las 3 columnas editoriales estáticas por categoría alimentadas desde
 * portfolio.sqlite, sin recorte ni desplazamiento horizontal, con enlace a /stack.
 */
export function StackSection({
  items,
  viewAllHref = '/stack',
}: StackSectionProps) {
  const t = useTranslations('Stack');

  return (
    <section id="stack" className="flex flex-col gap-6 scroll-mt-24">
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
        {HOME_COLUMNS.map((col) => {
          const sectionItems = items.filter((i) => i.category === col.category);
          if (sectionItems.length === 0) return null;

          return (
            <div key={col.category} className="flex flex-col gap-3 min-w-0">
              <h3 className="text-[11px] font-mono text-gold-400 tracking-wider uppercase">
                {t(col.titleKey)}
              </h3>

              <ul className="flex flex-wrap items-center gap-x-2 gap-y-1.5 leading-relaxed">
                {sectionItems.map((item, idx) => (
                  <li key={item.id} className="inline-flex items-center gap-2">
                    <span className="text-xs font-mono text-foreground/85 hover:text-gold-200 transition-colors">
                      {item.name}
                    </span>
                    {idx < sectionItems.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="text-gold-400/50 select-none"
                      >
                        •
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
