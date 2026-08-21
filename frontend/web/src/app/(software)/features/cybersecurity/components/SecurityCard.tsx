'use client';

import React from 'react';
import Link from 'next/link';
import { SecurityPost } from '../types';

interface SecurityCardProps {
  post: SecurityPost;
}

export function SecurityCard({ post }: SecurityCardProps) {
  const severityColors: Record<string, string> = {
    CRITICAL: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
    HIGH: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    LOW: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };

  const badgeColor = severityColors[post.severity] || severityColors.MEDIUM;

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
              {post.severity}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-zinc-800 text-zinc-300 border border-zinc-700">
              {post.postType}
            </span>
          </div>
          {post.cveId && <span className="text-xs font-mono text-rose-400">{post.cveId}</span>}
        </div>

        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-rose-400 transition-colors leading-snug mb-2">
          {post.title}
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-3 mb-4 leading-relaxed font-light">
          {post.excerpt}
        </p>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="text-xs text-zinc-500 truncate max-w-[200px]">
          {post.affectedSystems || 'General Linux/Web'}
        </div>

        <Link
          href={`/software/cybersecurity/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
        >
          Ver remediación
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
