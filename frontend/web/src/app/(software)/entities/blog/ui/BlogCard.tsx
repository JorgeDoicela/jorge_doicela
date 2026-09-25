'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { BlogPost } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const locale = useLocale();
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  const moduleLabel = tNav('blog').toUpperCase();
  const catKey = post.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' ')).toUpperCase()
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  return (
    <SoftwareCard
      href={`/blog/${post.slug}`}
      title={post.title}
      category="blog"
      coverImage={post.coverImage}
      tag={post.series || tNav('blog')}
      categoryMeta={metaText}
      excerpt={post.subtitle ? `${post.subtitle} — ${post.excerpt}` : post.excerpt}
      accentHoverColor="group-hover:text-blue-300"
    />
  );
}
