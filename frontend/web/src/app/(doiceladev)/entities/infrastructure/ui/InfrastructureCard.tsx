'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { InfrastructurePost } from '../types';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

interface InfrastructureCardProps {
  post: InfrastructurePost;
  priority?: boolean;
}

export function InfrastructureCard({ post, priority = false }: InfrastructureCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');
  const moduleLabel = tNav('infrastructure');
  const catKey = post.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as never) ? tFilters(catKey as never) : catKey.replace(/_/g, ' '))
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  return (
    <DoiceladevCard
      href={`/infrastructure/${post.slug}`}
      title={post.title}
      category="infrastructure"
      coverImage={post.coverImage}
      topicCategory={post.category}
      categoryMeta={metaText}
      excerpt={post.excerpt}
      priority={priority}
      accentHoverColor="group-hover:text-cyan-300"
    />
  );
}
