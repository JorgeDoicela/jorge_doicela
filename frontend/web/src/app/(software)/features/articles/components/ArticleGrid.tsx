'use client';

import { Article } from '../types';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

export function ArticleGrid({ articles, loading, error }: ArticleGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-8 rounded-3xl glass-convex-panel animate-pulse flex flex-col justify-between h-72">
            <div>
              <div className="h-5 w-24 bg-zinc-800 rounded-full mb-4"></div>
              <div className="h-7 w-3/4 bg-zinc-800 rounded-lg mb-3"></div>
              <div className="h-4 w-full bg-zinc-800/60 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-zinc-800/60 rounded"></div>
            </div>
            <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 p-8 rounded-3xl glass-convex-panel max-w-xl mx-auto border border-red-500/20">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-red-400 mb-2">Error de conexión</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 p-8 rounded-3xl glass-convex-panel max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-zinc-800/60 text-zinc-400 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-200 mb-2">No se encontraron artículos</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          No existen contenidos publicados que coincidan con la categoría o término de búsqueda seleccionado.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
