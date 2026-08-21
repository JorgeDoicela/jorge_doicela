'use client';

import React from 'react';
import Link from 'next/link';
import { Tutorial } from '../types';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const diffColors: Record<string, string> = {
    beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const badge = diffColors[tutorial.difficulty] || diffColors.intermediate;

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border uppercase ${badge}`}>
            {tutorial.difficulty}
          </span>
          <span className="text-xs text-zinc-500 font-mono">{tutorial.estimatedMinutes} min</span>
        </div>

        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-amber-400 transition-colors leading-snug mb-2">
          {tutorial.title}
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-3 mb-4 leading-relaxed font-light">
          {tutorial.excerpt}
        </p>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="text-xs text-zinc-500 truncate max-w-[180px]">
          {tutorial.techStack}
        </div>

        <Link
          href={`/software/tutorials/${tutorial.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          Iniciar guía
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
