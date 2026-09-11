'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { BlogPost } from '../types';
import { ArticleCover } from '../../../components/ArticleCover';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const locale = useLocale();
  const tNav = useTranslations('Nav');
  const tCard = useTranslations('CardActions');

  const formattedDate = new Date(post.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  return (
    <Link
      href={`/software/blog/${post.slug}`}
      className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#16202c]/80 hover:bg-white dark:hover:bg-[#1c2938] border border-slate-200/80 dark:border-white/[0.07] hover:border-blue-500/30 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] dark:shadow-none cursor-pointer"
    >
      <div className="space-y-3.5">
        <ArticleCover
          title={post.title}
          category="blog"
          coverImage={post.coverImage}
          tag={post.series || tNav('blog')}
        />

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold tracking-wide text-blue-600 dark:text-blue-400">
              {post.series || tNav('blog')}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono">{formattedDate}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-[var(--header-title)] group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>

          {post.subtitle && (
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400/80 mt-1 line-clamp-1">{post.subtitle}</p>
          )}

          <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal dark:font-light line-clamp-2 leading-relaxed mt-1.5">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-slate-200/70 dark:border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-500">
          <span>{tCard('likesCount', { count: post.likes })}</span>
          <span>•</span>
          <span>{tCard('viewsCount', { count: post.views })}</span>
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
          {tCard('readEssay')}
        </span>
      </div>
    </Link>
  );
}
