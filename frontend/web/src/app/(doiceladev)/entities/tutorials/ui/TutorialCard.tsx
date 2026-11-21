'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Tutorial } from '../types';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

interface TutorialCardProps {
  tutorial: Tutorial;
  priority?: boolean;
}

export function TutorialCard({ tutorial, priority = false }: TutorialCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');
  const moduleLabel = tNav('tutorials');
  const catKey = tutorial.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as never) ? tFilters(catKey as never) : catKey.replace(/_/g, ' '))
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
      priority={priority}
      accentHoverColor="group-hover:text-amber-300"
    />
  );
}
