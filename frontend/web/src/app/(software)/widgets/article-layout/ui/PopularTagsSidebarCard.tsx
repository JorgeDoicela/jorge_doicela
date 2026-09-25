'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSoftwareHub } from '../../../entities/hub/api/useSoftwareHub';
import { useSpotlight } from '../../../features/spotlight-search';

interface PopularTagsSidebarCardProps {
  className?: string;
  limit?: number;
}

interface TagFrequency {
  name: string;
  count: number;
}

export function PopularTagsSidebarCard({
  className = '',
  limit = 8,
}: PopularTagsSidebarCardProps) {
  const t = useTranslations('ArticleLayout');
  const { openSpotlight } = useSpotlight();
  const { spotlightData, loading } = useSoftwareHub();

  // Cálculo reactivo puro y memoizado de los tags más frecuentes
  const popularTags = useMemo<TagFrequency[]>(() => {
    if (!spotlightData) return [];

    const tagCountMap = new Map<string, number>();

    // Colecciones con tags transversales en SQLite
    const collections = [
      spotlightData.news,
      spotlightData.posts,
      spotlightData.secPosts,
      spotlightData.tutorials,
      spotlightData.projects,
      spotlightData.infraPosts,
      spotlightData.topics,
      spotlightData.aiResources,
    ];

    for (const list of collections) {
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (!item || typeof (item as any).tags !== 'string') continue;
        const rawTags = (item as any).tags as string;
        const splitTags = rawTags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);

        for (const tag of splitTags) {
          tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
        }
      }
    }

    return Array.from(tagCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, limit);
  }, [spotlightData, limit]);

  return (
    <div
      className={`p-6 rounded-3xl glass-convex-panel border border-black/5 dark:border-white/5 space-y-3.5 shadow-xl select-none ${className}`}
    >
      {/* Cabecera limpia sin el símbolo # en el título */}
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
          {t('popularTags')}
        </h5>
      </div>

      {loading && popularTags.length === 0 ? (
        <div className="space-y-1.5 pt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-xl bg-slate-200/50 dark:bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : popularTags.length === 0 ? null : (
        /* Lista vertical limpia de etiquetas sin marco invasivo de píldora */
        <div className="space-y-1" role="list" aria-label={t('popularTags')}>
          {popularTags.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => openSpotlight(name)}
              role="listitem"
              className="group flex items-center justify-between w-full py-2 px-3 rounded-xl hover:bg-black/[0.035] dark:hover:bg-white/[0.035] transition-all duration-200 text-left cursor-pointer active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
              title={`#${name} (${count})`}
            >
              {/* Lado izquierdo: # distintivo del tag + nombre en tipografía mono */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-cyan-600/80 dark:text-cyan-400/80 font-semibold font-mono text-xs">
                  #
                </span>
                <span className="text-xs sm:text-[13px] font-mono text-slate-700 dark:text-zinc-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                  {name}
                </span>
              </div>

              {/* Lado derecho: pastilla cóncava neumórfica sutil con contador */}
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono glass-concave-panel text-slate-500 dark:text-zinc-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 shrink-0 transition-colors">
                {count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
