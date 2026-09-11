'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Tutorial } from '../types';
import { ArticleCover } from '../../../components/ArticleCover';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const tCard = useTranslations('CardActions');
  const tFilters = useTranslations('Filters');

  const diffColors: Record<string, string> = {
    beginner: 'text-emerald-400',
    intermediate: 'text-amber-400',
    advanced: 'text-rose-400',
  };

  const badgeColor = diffColors[tutorial.difficulty] || diffColors.intermediate;
  const difficultyLabel = tFilters(tutorial.difficulty as any) || tutorial.difficulty;

  return (
    <Link
      href={`/software/tutorials/${tutorial.slug}`}
      className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#16202c]/80 hover:bg-white dark:hover:bg-[#1c2938] border border-slate-200/80 dark:border-white/[0.07] hover:border-amber-500/30 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] dark:shadow-none cursor-pointer"
    >
      <div className="space-y-3.5">
        <ArticleCover
          title={tutorial.title}
          category="tutorials"
          coverImage={tutorial.coverImage}
          tag={difficultyLabel}
        />

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[11px] font-mono font-bold tracking-wide uppercase ${badgeColor}`}>
              {difficultyLabel}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono">
              {tutorial.estimatedMinutes} min
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-[var(--header-title)] group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
            {tutorial.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal dark:font-light line-clamp-2 leading-relaxed mt-1.5">
            {tutorial.excerpt}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-slate-200/70 dark:border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="text-slate-500 dark:text-zinc-500 truncate max-w-[180px]">
          {tutorial.techStack}
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
          {tCard('startGuide')}
        </span>
      </div>
    </Link>
  );
}
