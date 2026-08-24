'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wide text-rose-500 dark:text-rose-400">
              {post.series || 'Arquitectura'}
            </span>
          </div>
          <span className="text-xs text-zinc-500 font-mono">{formattedDate}</span>
        </div>

        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-emerald-400 transition-colors leading-snug mb-1">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="text-xs font-medium text-emerald-400/80 mb-2">{post.subtitle}</p>
        )}

        <p className="text-sm text-zinc-400 line-clamp-3 mb-4 leading-relaxed font-light">
          {post.excerpt}
        </p>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>{post.readTimeMinutes} min</span>
          <span>•</span>
          <span>{post.likes} likes</span>
          <span>•</span>
          <span>{post.views} vistas</span>
        </div>

        <Link
          href={`/software/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Leer ensayo →
        </Link>
      </div>
    </div>
  );
}
