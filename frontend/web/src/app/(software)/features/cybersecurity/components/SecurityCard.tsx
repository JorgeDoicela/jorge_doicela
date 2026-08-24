'use client';

import React from 'react';
import Link from 'next/link';
import { SecurityPost } from '../types';

interface SecurityCardProps {
  post: SecurityPost;
}

export function SecurityCard({ post }: SecurityCardProps) {
  const severityColors: Record<string, string> = {
    CRITICAL: 'text-rose-400 border-rose-500/40 animate-pulse',
    HIGH: 'text-orange-400 border-orange-500/40',
    MEDIUM: 'text-amber-400 border-amber-500/40',
    LOW: 'text-emerald-400 border-emerald-500/40',
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide text-zinc-400 border border-zinc-700">
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
          Ver remediación →
        </Link>
      </div>
    </div>
  );
}
