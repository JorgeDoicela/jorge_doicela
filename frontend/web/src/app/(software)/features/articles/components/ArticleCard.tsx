'use client';

import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

const CATEGORY_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  news: { label: 'Noticia', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  blog: { label: 'Blog', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  ai: { label: 'IA', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  cybersecurity: { label: 'Ciberseguridad', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  tutorial: { label: 'Tutorial', bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
};

export function ArticleCard({ article }: ArticleCardProps) {
  const badge = CATEGORY_BADGES[article.category] || {
    label: article.category,
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
  };

  const tagList = article.tags ? article.tags.split(',').map((t) => t.trim()) : [];

  return (
    <article className="group relative flex flex-col justify-between p-6 md:p-8 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5">
      <div>
        {/* Header con Badge de Categoría y Tiempo de Lectura */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
            {badge.label}
          </span>
          <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {article.readTimeMinutes} min de lectura
          </span>
        </div>

        {/* Título */}
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)] mb-3 group-hover:text-indigo-400 transition-colors">
          {article.title}
        </h2>

        {/* Extracto */}
        <p className="text-sm md:text-base text-[var(--header-p)] line-clamp-3 leading-relaxed mb-6">
          {article.excerpt}
        </p>
      </div>

      <div>
        {/* Tags */}
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {tagList.map((tag) => (
              <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-md bg-zinc-800/60 text-zinc-400 font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer info: Autor, Fecha e Métricas */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-zinc-700/60 flex items-center justify-center text-[10px] font-bold text-white uppercase">
              {article.author.charAt(0)}
            </span>
            <span className="font-medium text-zinc-300">{article.author}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1" title="Visualizaciones">
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.views}
            </span>
            <span className="flex items-center gap-1" title="Me gusta">
              <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {article.likes}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
