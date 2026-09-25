'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Tutorial } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');
  const diffKey = tutorial.difficulty?.toLowerCase() || '';
  const difficultyLabel = diffKey
    ? (tFilters.has(diffKey as any) ? tFilters(diffKey as any) : tutorial.difficulty)
    : '';
  const moduleLabel = tNav('tutorials').toUpperCase();
  const catKey = tutorial.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' ')).toUpperCase()
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  return (
    <SoftwareCard
      href={`/tutorials/${tutorial.slug}`}
      title={tutorial.title}
      category="tutorials"
      coverImage={tutorial.coverImage}
      tag={difficultyLabel.toUpperCase()}
      categoryMeta={metaText}
      excerpt={tutorial.excerpt}
      accentHoverColor="group-hover:text-amber-300"
    />
  );
}
