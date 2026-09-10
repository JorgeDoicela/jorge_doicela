'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { NewsArticle } from '../types';
import { NewsCard } from './NewsCard';

interface NewsGridProps {
  news: NewsArticle[];
  loading: boolean;
  error: string | null;
}

export function NewsGrid({ news, loading, error }: NewsGridProps) {
  const t = useTranslations('News');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-48 rounded-3xl glass-convex-panel bg-zinc-900/30" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 rounded-3xl glass-concave-panel text-center text-rose-400">
        <p className="text-sm font-medium">{t('loadError', { error })}</p>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl glass-concave-panel text-center text-zinc-500">
        <p className="text-base font-medium">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {news.map((item) => (
        <NewsCard key={item.id} article={item} />
      ))}
    </div>
  );
}
