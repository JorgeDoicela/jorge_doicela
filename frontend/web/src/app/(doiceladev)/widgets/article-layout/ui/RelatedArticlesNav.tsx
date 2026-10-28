'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { RecommendationCard } from '../../../entities/portal/types';
import { DoiceladevSection } from '../../category-nav/ui/CategoryNav';
import { ArticleCover } from '../../../shared/ui/ArticleCover';

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayItems.map((item) => (
          <Link
            key={item.id || item.href}
            href={item.href}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl glass-convex-panel border border-black/5 dark:border-white/5 hover:border-cyan-500/30 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
          >
            <div className="space-y-3">
              {/* Portada / Imagen de la publicación */}
              <ArticleCover
                title={item.title}
                category={item.category}
                coverImage={item.coverImage}
                tag={item.tag}
              />

              {/* Categoría técnica en tipografía mono */}
              <div className="text-[11px] font-mono">
                <span className="font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  {tNav(item.category as any) || item.categoryMeta}
                </span>
              </div>

              {/* Título de la lectura recomendada */}
              <h5 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h5>
            </div>

            {/* Pie de la tarjeta: Acción con flecha animada */}
            <div className="pt-3 mt-3 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              <span>{t('readArticle')}</span>
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
