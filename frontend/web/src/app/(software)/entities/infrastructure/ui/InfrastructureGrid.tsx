'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { InfrastructurePost } from '../types';
import { InfrastructureCard } from './InfrastructureCard';

interface InfrastructureGridProps {
  posts: InfrastructurePost[];
  loading: boolean;
  error: string | null;
}

export function InfrastructureGrid({ posts, loading, error }: InfrastructureGridProps) {
  const t = useTranslations('Infrastructure');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-64 rounded-2xl bg-slate-200/70 dark:bg-[#16202c]/80 border border-slate-200/80 dark:border-white/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 rounded-3xl glass-concave-panel text-center text-rose-400">
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl glass-concave-panel text-center text-zinc-500">
        <p className="text-base font-medium">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {posts.map((post) => (
        <InfrastructureCard key={post.id} post={post} />
      ))}
    </div>
  );
}
