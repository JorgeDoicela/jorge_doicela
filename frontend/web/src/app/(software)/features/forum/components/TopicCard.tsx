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
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {topic.isPinned && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Fijado
            </span>
          )}
          {topic.isSolved && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Resuelto
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{topic.repliesCount}</span>
        </div>

        <div className="text-xs text-zinc-500">
          <span>{topic.views} vistas</span>
        </div>

        <Link
          href={`/software/forum/${topic.slug}`}
          className="p-2 rounded-xl glass-btn-neumorphic text-zinc-400 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
