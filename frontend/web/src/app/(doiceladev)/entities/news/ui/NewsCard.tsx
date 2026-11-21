'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { NewsArticle } from '../types';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

interface NewsCardProps {
  article: NewsArticle;
  priority?: boolean;
}

export function NewsCard({ article, priority = false }: NewsCardProps) {
  const locale = useLocale();
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  const moduleLabel = tNav('news');
  const catKey = article.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as never) ? tFilters(catKey as never) : catKey.replace(/_/g, ' '))
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  return (
    <DoiceladevCard
      href={`/news/${article.slug}`}
      title={article.title}
      category="news"
      coverImage={article.coverImage}
      categoryMeta={metaText}
      topicCategory={article.category}
      excerpt={article.excerpt}
      priority={priority}
      accentHoverColor="group-hover:text-cyan-300"
    />
  );
}
