'use client';

import React from 'react';
import { ArchaeologyArticle } from '../types';

interface ArticleCardProps {
  article: ArchaeologyArticle;
  onReadArticle: (articleId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onReadArticle }) => {
  const categoryBadgeClass =
    article.category === 'recent_discoveries'
      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      : article.category === 'manuscripts_epigraphy'
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';

  const categoryLabel =
    article.category === 'recent_discoveries'
      ? 'Hallazgo Reciente'
      : article.category === 'manuscripts_epigraphy'
      ? 'Manuscritos & Epigrafía'
      : 'Apologética & Rigor Histórico';

  return (
    <div
      onClick={() => onReadArticle(article.id)}
      className="p-5 rounded-xl border border-accents-2 bg-background hover:border-foreground/30 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-xs cursor-pointer group select-none"
    >
      <div className="space-y-2.5">
        {/* Encabezado: Categoría, Región y Tiempo de lectura */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${categoryBadgeClass}`}
            >
              {categoryLabel}
            </span>
            <span className="text-[10px] font-mono text-accents-4">
              {article.regionLabel}
            </span>
          </div>

          <span className="text-[10px] font-mono text-accents-4">
            {article.readTimeMinutes} min de lectura
          </span>
        </div>

        {/* Título y Resumen */}
        <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-blue-500 transition-colors">
          {article.title}
        </h3>

        <p className="text-xs text-accents-5 leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        {/* Pasajes bíblicos conectados */}
        <div className="flex flex-wrap gap-1 pt-1">
          {article.biblicalReferences.map((ref, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded bg-accents-1 border border-accents-2 text-[10px] font-mono text-blue-500"
            >
              {ref.reference}
            </span>
          ))}
        </div>
      </div>

      {/* Pie de tarjeta: Autor/Institución y Botón Leer */}
      <div className="flex items-center justify-between pt-3 border-t border-accents-2/70 text-xs">
        <span className="text-[11px] font-mono text-accents-4 truncate max-w-[200px]">
          {article.institutionOrAuthor.split('/')[0]}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReadArticle(article.id);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background group-hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
        >
          <span>Leer Artículo</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
