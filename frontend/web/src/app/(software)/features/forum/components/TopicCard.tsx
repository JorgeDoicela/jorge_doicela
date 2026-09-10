'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ForumTopic } from '../types';

interface TopicCardProps {
  topic: ForumTopic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const locale = useLocale();
  const tCard = useTranslations('CardActions');
  const tCommon = useTranslations('Common');

  const formattedDate = new Date(topic.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  return (
    <Link
      href={`/software/forum/${topic.slug}`}
      className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-xl gap-4 block cursor-pointer"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          {topic.isPinned && (
            <span className="text-[11px] font-mono font-bold uppercase text-amber-500 dark:text-amber-400">
              {tCard('pinned')}
            </span>
          )}
          {topic.isSolved && (
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-500 dark:text-emerald-400">
              {tCard('solved')}
            </span>
          )}
          <span className="text-[11px] font-mono font-bold uppercase text-blue-500 dark:text-blue-400">
            {topic.category}
          </span>
          <span className="text-xs text-zinc-500 font-mono">• {tCommon('author', { name: topic.author })}</span>
          <span className="text-xs text-zinc-500 font-mono">• {formattedDate}</span>
        </div>

        <h3 className="text-base md:text-lg font-bold text-[var(--foreground)] group-hover:text-blue-400 transition-colors leading-snug">
          {topic.title}
        </h3>
        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-light">
          {topic.content}
        </p>
      </div>

      <div className="flex items-center gap-4 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-concave-panel text-xs text-blue-400 font-semibold font-mono">
          <span>{tCard('repliesCount', { count: topic.repliesCount })}</span>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          <span>{tCard('viewsCount', { count: topic.views })}</span>
        </div>

        <span className="px-3 py-1.5 rounded-xl glass-btn-neumorphic text-xs font-semibold text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
          {tCard('viewTopic')}
        </span>
      </div>
    </Link>
  );
}
