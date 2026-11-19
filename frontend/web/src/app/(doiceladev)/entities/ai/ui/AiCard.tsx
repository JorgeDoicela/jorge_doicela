'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AiResource } from '../types';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

interface AiCardProps {
  resource: AiResource;
  priority?: boolean;
}

export function AiCard({ resource, priority = false }: AiCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');

  const catKey = resource.category?.toLowerCase() || '';
  const categoryLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' '))
    : '';

  const moduleLabel = tNav('ai');
  const metaText = categoryLabel ? `${moduleLabel} • ${categoryLabel}` : moduleLabel;

  return (
    <DoiceladevCard
      href={`/ai/${resource.slug}`}
      title={resource.title}
      category="ai"
      coverImage={resource.coverImage}
      categoryMeta={metaText}
      topicCategory={resource.category}
      excerpt={resource.excerpt}
      priority={priority}
      accentHoverColor="group-hover:text-purple-300"
    />
  );
}
