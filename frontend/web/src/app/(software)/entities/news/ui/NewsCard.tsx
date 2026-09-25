'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { NewsArticle } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
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

  const moduleLabel = tNav('news').toUpperCase();
  const catKey = article.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' ')).toUpperCase()
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;
  const breakingTag = article.isBreaking ? (locale === 'es' ? 'URGENTE' : 'BREAKING') : undefined;

  return (
    <SoftwareCard
      href={`/news/${article.slug}`}
      title={article.title}
      category="news"
      coverImage={article.coverImage}
      tag={breakingTag}
      categoryMeta={metaText}
      excerpt={article.excerpt}
      accentHoverColor="group-hover:text-cyan-300"
    />
  );
}
