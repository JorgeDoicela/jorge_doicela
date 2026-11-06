'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Tutorial } from '../types';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');
  const moduleLabel = tNav('tutorials').toUpperCase();
  const catKey = tutorial.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' ')).toUpperCase()
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  return (
    <DoiceladevCard
      href={`/tutorials/${tutorial.slug}`}
      title={tutorial.title}
      category="tutorials"
      coverImage={tutorial.coverImage}
      categoryMeta={metaText}
      topicCategory={tutorial.category}
      excerpt={tutorial.excerpt}
      accentHoverColor="group-hover:text-amber-300"
    />
  );
}
