'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { NewsArticle } from '../types';
import { ArticleCover } from '../../../components/ArticleCover';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const locale = useLocale();
  const tNav = useTranslations('Nav');
  const tCard = useTranslations('CardActions');

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  return (
    <Link
      href={`/software/news/${article.slug}`}
      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm cursor-pointer"
    >
      <div className="space-y-3.5">
        <ArticleCover
          title={article.title}
          category="news"
          coverImage={article.coverImage}
          tag={article.isBreaking ? 'BREAKING' : undefined}
        />

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold tracking-wide text-cyan-400">
              {article.isBreaking ? 'BREAKING — ' : ''}{tNav('news')}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">{formattedDate}</span>
          </div>

          <h3 className="text-base font-bold text-[var(--header-title)] group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-500">
          {tCard('viewsCount', { count: article.views })}
        </span>

        <span className="inline-flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
          {tCard('readNote')}
        </span>
      </div>
    </Link>
  );
}
