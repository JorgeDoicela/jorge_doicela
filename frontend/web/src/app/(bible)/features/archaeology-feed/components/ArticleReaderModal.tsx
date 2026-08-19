'use client';

import React from 'react';
import { ArchaeologyArticle } from '../types';
import { EpigraphyViewer } from './EpigraphyViewer';

interface ArticleReaderModalProps {
  article: ArchaeologyArticle | null;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-background border border-accents-2 rounded-2xl shadow-2xl overflow-y-auto flex flex-col p-6 sm:p-8 space-y-6">
        {/* Cabecera del Lector */}
        <div className="flex items-start justify-between border-b border-accents-2 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-500 font-semibold">
                {article.regionLabel}
              </span>
              <span className="text-[10px] font-mono text-accents-4">•</span>
              <span className="text-[10px] font-mono text-accents-4">
                Publicado: {article.publishDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {article.title}
            </h2>
            <p className="text-xs text-accents-5 font-mono">
              Institución: {article.institutionOrAuthor}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-accents-4 hover:text-foreground hover:bg-accents-1 transition-colors cursor-pointer"
            title="Cerrar artículo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ficha del Artefacto y Museo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-accents-1/60 border border-accents-2 text-xs">
          <div>
            <span className="text-[10px] font-mono uppercase text-accents-4 block">
              Artefacto Principal:
            </span>
            <p className="font-semibold text-foreground">{article.keyArtifact}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-accents-4 block">
              Custodia Actual / Museo:
            </span>
            <p className="font-semibold text-foreground">{article.museumOrLocation}</p>
          </div>
        </div>

        {/* Visor Epigráfico si existe */}
        {article.epigraphy && <EpigraphyViewer epigraphy={article.epigraphy} />}

        {/* Contenido del Artículo */}
        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-4 font-sans whitespace-pre-line">
          {article.contentMarkdown}
        </div>

        {/* Referencias Bíblicas Conectadas */}
        <div className="p-4 rounded-xl border border-accents-2 bg-background space-y-2 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accents-5">
            Pasajes Bíblicos Vinculados al Hallazgo
          </h4>
          <div className="space-y-2">
            {article.biblicalReferences.map((ref, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-accents-1 border border-accents-2 text-xs space-y-0.5">
                <span className="font-bold text-blue-500 font-mono text-[11px] block">
                  {ref.reference}
                </span>
                <p className="text-accents-5 text-[11px]">{ref.context}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="flex items-center justify-between pt-4 border-t border-accents-2 text-xs">
          <div className="flex flex-wrap gap-1">
            {article.tags.map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-accents-1 text-[10px] font-mono text-accents-4">
                #{t}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            Cerrar Lectura
          </button>
        </div>
      </div>
    </div>
  );
};
