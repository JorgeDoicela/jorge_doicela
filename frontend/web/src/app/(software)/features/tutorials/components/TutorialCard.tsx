'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Tutorial } from '../types';
import { SoftwareCard } from '../../../components/SoftwareCard';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const tFilters = useTranslations('Filters');
  const difficultyLabel = tFilters(tutorial.difficulty as any) || tutorial.difficulty;
  const metaText = `${difficultyLabel} • ${tutorial.techStack}`;

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
