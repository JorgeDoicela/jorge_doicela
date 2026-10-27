'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useSpotlight } from '../../../features/spotlight-search';

interface ArticleTagsProps {
  tags?: string[] | string;
  className?: string;
}

export function ArticleTags({ tags, className = '' }: ArticleTagsProps) {
  const t = useTranslations('ArticleLayout');
  const { openSpotlight } = useSpotlight();

  const parsedTags = React.useMemo(() => {
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    }
    return tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }, [tags]);

  if (parsedTags.length === 0) return null;

  return (
    <section
      aria-label={t('topicsTitle')}
      className={`pt-8 mt-12 border-t border-black/5 dark:border-white/5 space-y-3.5 select-none ${className}`}
    >
      <div className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400">
        <span>{t('topicsTitle')}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {parsedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => openSpotlight(tag)}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-concave-panel border border-black/5 dark:border-white/5 text-xs font-mono text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
            title={t('searchTagHint', { tag })}
          >
            <span className="text-cyan-600/70 dark:text-cyan-400/70 font-semibold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              #
            </span>
            <span>{tag}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
