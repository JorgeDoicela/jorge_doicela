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
    <div className="group relative flex flex-col justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {article.isBreaking && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-rose-400 border border-rose-500/40 animate-pulse">
                Breaking
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide text-blue-400 border border-blue-500/30">
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
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>{article.readTimeMinutes} min de lectura</span>
          <span>•</span>
          <span>{article.views} vistas</span>
        </div>

        <Link
          href={`/software/news/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          Leer nota →
        </Link>
      </div>
    </div>
  );
}
