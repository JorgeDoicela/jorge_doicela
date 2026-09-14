'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { NewsArticle } from '../types';
import { SoftwareCard } from '../../../components/SoftwareCard';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const locale = useLocale();
  const tNav = useTranslations('Nav');

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  const metaText = `${article.isBreaking ? 'BREAKING • ' : ''}${tNav('news')} • ${formattedDate}`;

  return (
    <SoftwareCard
      href={`/news/${article.slug}`}
      title={article.title}
      category="news"
      coverImage={article.coverImage}
      tag={article.isBreaking ? 'BREAKING' : undefined}
      categoryMeta={metaText}
      excerpt={article.excerpt}
      accentHoverColor="group-hover:text-cyan-300"
    />
  );
}
