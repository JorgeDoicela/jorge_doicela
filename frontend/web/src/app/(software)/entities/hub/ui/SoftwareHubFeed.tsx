'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';
import { HubFeedItem } from '../types';

interface SoftwareHubFeedProps {
  feed: HubFeedItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function SoftwareHubFeed({
  feed,
  isLoading,
  error,
  onRetry,
}: SoftwareHubFeedProps) {
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');

  return (
    <section className="animate-in fade-in duration-300">
      {/* Contenedor Único para toda la Grilla de Publicaciones */}
      <div className="p-5 sm:p-6 rounded-3xl glass-convex-panel space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
            {tHome('latestPosts')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && feed.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-zinc-400">
              <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-mono tracking-wider uppercase text-zinc-500">
                {tCommon('loading')}
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center glass-concave-panel rounded-2xl border border-red-500/20 p-6 space-y-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-red-600 dark:text-red-300">{tHome('syncError')}</p>
                <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-md">{error}</p>
              </div>
              <button
                type="button"
                onClick={onRetry}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 text-white dark:bg-white/10 dark:hover:bg-white/15 dark:text-white transition-colors border border-slate-700 dark:border-white/10 flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {tHome('retryConnection')}
              </button>
            </div>
          )}

          {!isLoading && !error && feed.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-zinc-500 glass-concave-panel rounded-2xl border border-slate-200/80 dark:border-white/5">
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">{tCommon('notFound')}</p>
            </div>
          )}

          {feed.map((item) => (
            <SoftwareCard
              key={item.id}
              href={item.href}
              title={item.title}
              category={item.category}
              coverImage={item.coverImage}
              tag={item.tag}
              categoryMeta={item.categoryMeta}
              excerpt={item.excerpt}
              accentHoverColor={item.accentHoverColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
