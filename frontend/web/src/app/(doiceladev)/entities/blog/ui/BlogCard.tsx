'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BlogPost } from '../types';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

interface BlogCardProps {
  post: BlogPost;
  priority?: boolean;
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');

  const moduleLabel = tNav('blog');
  const catKey = post.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as never) ? tFilters(catKey as never) : catKey.replace(/_/g, ' '))
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  return (
    <DoiceladevCard
      href={`/blog/${post.slug}`}
      title={post.title}
      category="blog"
      coverImage={post.coverImage}
      categoryMeta={metaText}
      topicCategory={post.category}
      excerpt={post.excerpt}
      priority={priority}
      accentHoverColor="group-hover:text-blue-300"
    />
  );
}
