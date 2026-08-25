'use client';

import React from 'react';
import Link from 'next/link';
import { SecurityPost } from '../types';

interface SecurityCardProps {
  post: SecurityPost;
}

export function SecurityCard({ post }: SecurityCardProps) {
  const severityColors: Record<string, string> = {
    CRITICAL: 'text-rose-500 dark:text-rose-400 font-bold',
    HIGH: 'text-orange-500 dark:text-orange-400 font-bold',
    MEDIUM: 'text-amber-500 dark:text-amber-400 font-semibold',
    LOW: 'text-emerald-500 dark:text-emerald-400 font-semibold',
  };

  const badgeColor = severityColors[post.severity] || severityColors.MEDIUM;

  return (
    <Link
      href={`/software/cybersecurity/${post.slug}`}
      className="group relative flex flex-col justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl block cursor-pointer"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${badgeColor}`}>
              {post.severity}
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
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
        <div className="text-xs text-zinc-500 truncate max-w-[200px] font-mono">
          {post.affectedSystems || 'General Linux/Web'}
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 group-hover:translate-x-1 transition-transform">
          Ver remediación →
        </span>
      </div>
    </Link>
  );
}
