'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { SecurityPost } from '../types';
import { SecurityCard } from './SecurityCard';
import { DoiceladevCardSkeleton } from '../../../shared/ui/DoiceladevCardSkeleton';

interface SecurityGridProps {
  posts: SecurityPost[];
  loading: boolean;
  error: string | null;
}

export function SecurityGrid({ posts, loading, error }: SecurityGridProps) {
  const t = useTranslations('Cybersecurity');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, idx) => (
          <DoiceladevCardSkeleton key={idx} />
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
        <SecurityCard key={post.id} post={post} />
      ))}
    </div>
  );
}
