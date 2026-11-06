'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { RecommendationCard } from '../../../entities/portal/types';
import { DoiceladevSection } from '../../category-nav/ui/CategoryNav';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

interface RelatedArticlesNavProps {
  currentCategory: DoiceladevSection;
  currentTitle: string;
  recommendations?: RecommendationCard[];
  className?: string;
  limit?: number;
}

export function RelatedArticlesNav({
  recommendations = [],
  className = '',
  limit = 3,
}: RelatedArticlesNavProps) {
  const t = useTranslations('ArticleLayout');
  const tNav = useTranslations('Nav');

  const displayItems = recommendations.slice(0, limit);

  if (displayItems.length === 0) return null;

  return (
    <section
      aria-label={t('relatedArticlesTitle')}
      className={`space-y-4 select-none ${className}`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400">
          {t('relatedArticlesTitle')}
        </h4>
      </div>

      <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none no-scrollbar gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 -mx-1 px-1 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
        {displayItems.map((item) => (
          <div
            key={item.id || item.href}
            className="shrink-0 w-[84%] sm:w-auto snap-start flex flex-col"
          >
            <DoiceladevCard
              href={item.href}
              title={item.title}
              category={item.category}
              coverImage={item.coverImage}
              categoryMeta={item.categoryMeta || tNav(item.category as any)}
              excerpt={item.excerpt}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
