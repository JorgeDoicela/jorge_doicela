'use client';

import React, { useMemo, useState } from 'react';
import { FileDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getPortfolioCvFilename, getPortfolioCvPath } from '../../../shared';
import { ExperienceTimelineSection } from './ExperienceTimelineSection';
import type { ExperienceType, PortfolioExperienceItem } from '../types';

type ExperienceFilter = 'all' | ExperienceType;

interface ExperienceDetailViewProps {
  items: PortfolioExperienceItem[];
}

const TIMELINE_SLUG_ORDER: readonly string[] = [
  'istpet-software-developer',
  'ub-ai-cybersecurity',
  'cnc-backend',
  'traversari-software-dev',
];

function sortChronologically(items: PortfolioExperienceItem[]): PortfolioExperienceItem[] {
  return [...items].sort((a, b) => {
    const idxA = TIMELINE_SLUG_ORDER.indexOf(a.slug);
    const idxB = TIMELINE_SLUG_ORDER.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.orderIndex - b.orderIndex;
  });
}

export function ExperienceDetailView({ items }: ExperienceDetailViewProps) {
  const locale = useLocale();
  const tExp = useTranslations('Experience');
  const [activeFilter, setActiveFilter] = useState<ExperienceFilter>('all');
  const cvPath = getPortfolioCvPath(locale);
  const cvFilename = getPortfolioCvFilename(locale);

  const orderedItems = useMemo(() => {
    const filtered =
      activeFilter === 'all'
        ? items
        : items.filter((item) => item.type === activeFilter);
    return sortChronologically(filtered);
  }, [activeFilter, items]);

  const filters: { id: ExperienceFilter; label: string }[] = [
    { id: 'all', label: tExp('filterAll') },
    { id: 'work', label: tExp('filterWork') },
    { id: 'education', label: tExp('filterEducation') },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Filtros de Trayectoria + Descarga de CV */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-surface border border-gold-300/80 text-foreground font-semibold shadow-sm'
                  : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5 border border-border/40'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <a
          href={cvPath}
          download={cvFilename}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-gold-400 hover:text-gold-200 transition-colors shrink-0"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>{tExp('downloadCv')}</span>
        </a>
      </div>

      <ExperienceTimelineSection
        key={activeFilter}
        items={orderedItems}
        workBadgeLabel={tExp('eyebrow')}
        eduBadgeLabel={tExp('eduEyebrow')}
        highlightsLabel={tExp('highlightsLabel')}
        stackUsedLabel={tExp('stackUsedLabel')}
      />
    </div>
  );
}
