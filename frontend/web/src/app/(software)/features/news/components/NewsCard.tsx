'use client';

import React from 'react';
import Link from 'next/link';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      href={`/software/news/${article.slug}`}
      className="group relative flex flex-col justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl block cursor-pointer"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {article.isBreaking && (
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                Breaking
              </span>
            )}
            <span className="text-[11px] font-mono font-bold tracking-wide text-cyan-500 dark:text-cyan-400">
              Noticia
            </span>
          </div>
          <span className="text-xs text-zinc-500 font-mono">{formattedDate}</span>
        </div>

        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-blue-400 transition-colors leading-snug mb-2">
          {article.title}
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-3 mb-4 leading-relaxed font-light">
          {article.excerpt}
        </p>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <span>{article.readTimeMinutes} min de lectura</span>
          <span>•</span>
          <span>{article.views} vistas</span>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
          Leer nota →
        </span>
      </div>
    </Link>
  );
}
