'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AiResource } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface AiCardProps {
  resource: AiResource;
}

export function AiCard({ resource }: AiCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');

  const catKey = resource.category?.toLowerCase() || '';
  const categoryLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' ')).toUpperCase()
    : '';

  const moduleLabel = tNav('ai').toUpperCase();
  const metaText = categoryLabel ? `${moduleLabel} • ${categoryLabel}` : moduleLabel;

  return (
    <SoftwareCard
      href={`/ai/${resource.slug}`}
      title={resource.name}
      category="ai"
      coverImage={resource.coverImage}
      tag={resource.license?.toUpperCase() || categoryLabel}
      categoryMeta={metaText}
      excerpt={resource.description}
      accentHoverColor="group-hover:text-purple-300"
    />
  );
}
