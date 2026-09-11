'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SecurityPost } from '../types';
import { ArticleCover } from '../../../components/ArticleCover';

interface SecurityCardProps {
  post: SecurityPost;
}

export function SecurityCard({ post }: SecurityCardProps) {
  const tCard = useTranslations('CardActions');

  const severityColors: Record<string, string> = {
    CRITICAL: 'text-rose-400 font-bold',
    HIGH: 'text-orange-400 font-bold',
    MEDIUM: 'text-amber-400 font-semibold',
    LOW: 'text-emerald-400 font-semibold',
  };

  const badgeColor = severityColors[post.severity] || severityColors.MEDIUM;

  return (
    <Link
      href={`/software/cybersecurity/${post.slug}`}
      className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#16202c]/80 hover:bg-white dark:hover:bg-[#1c2938] border border-slate-200/80 dark:border-white/[0.07] hover:border-rose-500/30 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] dark:shadow-none cursor-pointer"
    >
      <div className="space-y-3.5">
        <ArticleCover
          title={post.title}
          category="cybersecurity"
          coverImage={post.coverImage}
          tag={post.cveId || post.severity}
        />

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono uppercase tracking-wider ${badgeColor}`}>
                {post.severity}
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                {post.postType}
              </span>
            </div>
            {post.cveId && <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400">{post.cveId}</span>}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-[var(--header-title)] group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal dark:font-light line-clamp-2 leading-relaxed mt-1.5">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-slate-200/70 dark:border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="text-zinc-500 truncate max-w-[200px]">
          {post.affectedSystems || 'Linux / Cloud / Web'}
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-rose-400 group-hover:translate-x-1 transition-transform">
          {tCard('viewRemediation')}
        </span>
      </div>
    </Link>
  );
}
