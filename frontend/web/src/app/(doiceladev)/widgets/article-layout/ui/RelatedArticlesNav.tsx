'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { useDoiceladevPortal } from '../../../entities/portal/api/useDoiceladevPortal';
import { PortalFeedItem } from '../../../entities/portal/types';
import { DoiceladevSection } from '../../category-nav/ui/CategoryNav';
import { ArticleCover } from '../../../shared/ui/ArticleCover';

interface RelatedArticlesNavProps {
  currentCategory: DoiceladevSection;
  currentTitle: string;
  className?: string;
  limit?: number;
}

export function RelatedArticlesNav({
  currentCategory,
  currentTitle,
  className = '',
  limit = 3,
}: RelatedArticlesNavProps) {
  const t = useTranslations('ArticleLayout');
  const tNav = useTranslations('Nav');
  const { feed, featured, loading } = useDoiceladevPortal();

  // Combina 'featured' y 'feed' deduplicando por id/href para garantizar acceso al 100% del catálogo editorial
  const allAvailableItems = useMemo(() => {
    const map = new Map<string, PortalFeedItem>();
    const list = [...(featured || []), ...(feed || [])];
    for (const item of list) {
      if (item && item.title) {
        const key = item.id || item.href || item.title;
        if (!map.has(key)) {
          map.set(key, item);
        }
      }
    }
    return Array.from(map.values());
  }, [featured, feed]);

  // Filtrado inteligente de lecturas recomendadas:
  // 1. Excluye el artículo actual comparando títulos normalizados.
  // 2. Prioriza artículos de la misma categoría o categorías afines del ecosistema.
  // 3. Fallback a publicaciones destacadas/recientes para garantizar que siempre se completen los 3 espacios.
  const relatedItems = useMemo(() => {
    if (allAvailableItems.length === 0) return [];

    const normalizedCurrent = currentTitle.trim().toLowerCase();
    const candidates = allAvailableItems.filter(
      (item) => item.title.trim().toLowerCase() !== normalizedCurrent
    );

    // Mapeo exhaustivo de afinidad técnica por categoría (con orden de precedencia y fallback total)
    const affinityMap: Record<string, string[]> = {
      infrastructure: ['infrastructure', 'cybersecurity', 'tutorials', 'projects', 'blog', 'forum', 'ai', 'news'],
      cybersecurity: ['cybersecurity', 'infrastructure', 'news', 'tutorials', 'projects', 'blog', 'forum', 'ai'],
      tutorials: ['tutorials', 'infrastructure', 'cybersecurity', 'projects', 'blog', 'ai', 'forum', 'news'],
      blog: ['blog', 'projects', 'infrastructure', 'ai', 'tutorials', 'cybersecurity', 'forum', 'news'],
      ai: ['ai', 'blog', 'projects', 'news', 'tutorials', 'infrastructure', 'cybersecurity', 'forum'],
      news: ['news', 'cybersecurity', 'ai', 'infrastructure', 'blog', 'tutorials', 'projects', 'forum'],
      projects: ['projects', 'infrastructure', 'tutorials', 'blog', 'cybersecurity', 'ai', 'forum', 'news'],
      forum: ['forum', 'tutorials', 'infrastructure', 'cybersecurity', 'blog', 'projects', 'ai', 'news'],
    };

    const preferredCategories = [
      currentCategory,
      ...(affinityMap[currentCategory] || []),
    ];

    const sorted = [...candidates].sort((a, b) => {
      const aIndex = preferredCategories.indexOf(a.category);
      const bIndex = preferredCategories.indexOf(b.category);

      const aWeight = aIndex !== -1 ? preferredCategories.length - aIndex : 0;
      const bWeight = bIndex !== -1 ? preferredCategories.length - bIndex : 0;

      if (bWeight !== aWeight) {
        return bWeight - aWeight;
      }

      return b.smartScore - a.smartScore;
    });

    return sorted.slice(0, limit);
  }, [allAvailableItems, currentCategory, currentTitle, limit]);

  if (loading && relatedItems.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-4 w-40 bg-slate-200/60 dark:bg-white/5 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="h-56 rounded-2xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          <div className="h-56 rounded-2xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          <div className="h-56 rounded-2xl bg-slate-200/50 dark:bg-white/5 animate-pulse hidden lg:block" />
        </div>
      </div>
    );
  }

  if (relatedItems.length === 0) return null;

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
        {relatedItems.map((item) => (
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
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
