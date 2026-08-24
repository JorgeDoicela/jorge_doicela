'use client';

import React from 'react';
import Link from 'next/link';
import { ForumTopic } from '../types';

interface TopicCardProps {
  topic: ForumTopic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const formattedDate = new Date(topic.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-xl gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          {topic.isPinned && (
            <span className="text-[11px] font-mono font-bold uppercase text-amber-500 dark:text-amber-400">
              Fijado
            </span>
          )}
          {topic.isSolved && (
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-500 dark:text-emerald-400">
              Resuelto
            </span>
          )}
          <span className="text-[11px] font-mono font-bold uppercase text-indigo-500 dark:text-indigo-400">
            {topic.category}
          </span>
          <span className="text-xs text-zinc-500">• Por {topic.author}</span>
          <span className="text-xs text-zinc-500">• {formattedDate}</span>
        </div>

        <Link href={`/software/forum/${topic.slug}`}>
          <h3 className="text-base md:text-lg font-bold text-[var(--foreground)] group-hover:text-indigo-400 transition-colors leading-snug">
            {topic.title}
          </h3>
        </Link>
        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-light">
          {topic.content}
        </p>
      </div>

      <div className="flex items-center gap-4 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-concave-panel text-xs text-indigo-400 font-semibold">
          <span>{topic.repliesCount} respuestas</span>
        </div>

        <div className="text-xs text-zinc-500">
          <span>{topic.views} vistas</span>
        </div>

        <Link
          href={`/software/forum/${topic.slug}`}
          className="px-3 py-1.5 rounded-xl glass-btn-neumorphic text-xs font-semibold text-zinc-400 hover:text-white"
        >
          Ver debate →
        </Link>
      </div>
    </div>
  );
}
