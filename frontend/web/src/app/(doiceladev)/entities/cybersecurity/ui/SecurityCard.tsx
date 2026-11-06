'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { SecurityPost } from '../types';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

interface SecurityCardProps {
  post: SecurityPost;
}

export function SecurityCard({ post }: SecurityCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');
  const moduleLabel = tNav('cybersecurity').toUpperCase();
  const catKey = post.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' ')).toUpperCase()
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  return (
    <DoiceladevCard
      href={`/cybersecurity/${post.slug}`}
      title={post.title}
      category="cybersecurity"
      coverImage={post.coverImage}
      categoryMeta={metaText}
      excerpt={post.excerpt}
      accentHoverColor="group-hover:text-rose-300"
    />
  );
}
