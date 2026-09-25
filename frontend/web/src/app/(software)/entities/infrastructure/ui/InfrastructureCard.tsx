'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { InfrastructurePost } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface InfrastructureCardProps {
  post: InfrastructurePost;
}

export function InfrastructureCard({ post }: InfrastructureCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');
  const moduleLabel = tNav('infrastructure').toUpperCase();
  const catKey = post.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' ')).toUpperCase()
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  const envKey = post.environment?.toLowerCase() || '';
  const envLabel = envKey
    ? (tFilters.has(envKey as any) ? tFilters(envKey as any) : envKey.replace(/_/g, ' ')).toUpperCase()
    : '';

  return (
    <SoftwareCard
      href={`/infrastructure/${post.slug}`}
      title={post.title}
      category="infrastructure"
      coverImage={post.coverImage}
      topicCategory={post.category}
      tag={envLabel}
      categoryMeta={metaText}
      excerpt={post.subtitle || post.architectureOverview}
      accentHoverColor="group-hover:text-cyan-300"
    />
  );
}
