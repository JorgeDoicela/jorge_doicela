'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ForumTopic } from '../types';
import { TopicCard } from './TopicCard';
import { DoiceladevCardSkeleton } from '../../../shared/ui/DoiceladevCardSkeleton';

interface ForumGridProps {
  topics: ForumTopic[];
  loading: boolean;
  error: string | null;
}

export function ForumGrid({ topics, loading, error }: ForumGridProps) {
  const t = useTranslations('Forum');

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
        <p className="text-sm font-medium">{t('loadError', { error })}</p>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl glass-concave-panel text-center text-zinc-500">
        <p className="text-base font-medium">{t('noTopics')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {topics.map((topic, idx) => (
        <TopicCard key={topic.id} topic={topic} priority={idx < 3} />
      ))}
    </div>
  );
}
