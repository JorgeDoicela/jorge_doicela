'use client';

import React from 'react';
import { ArticleCategory, GeographicRegion } from '../types';

interface FeedFilterBarProps {
  selectedCategory: ArticleCategory | 'all';
  onChangeCategory: (cat: ArticleCategory | 'all') => void;
  selectedRegion: GeographicRegion;
  onChangeRegion: (reg: GeographicRegion) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  feedViewMode: 'articles' | 'manuscripts';
  onChangeViewMode: (mode: 'articles' | 'manuscripts') => void;
  totalArticlesCount: number;
}

export const FeedFilterBar: React.FC<FeedFilterBarProps> = ({
  selectedCategory,
  onChangeCategory,
  selectedRegion,
  onChangeRegion,
  searchQuery,
  onChangeSearchQuery,
  feedViewMode,
  onChangeViewMode,
  totalArticlesCount,
}) => {
  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-accents-2 bg-background/80 backdrop-blur-md">
      {/* Fila 1: Buscador y Toggle de Vista (Artículos vs. Catálogo de Manuscritos) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            placeholder="Buscar por hallazgo, autor, manuscrito o pasaje..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-accents-2 rounded-lg text-foreground placeholder:text-accents-4 focus:outline-none focus:border-foreground transition-all"
          />
          <svg
            className="w-3.5 h-3.5 text-accents-4 absolute left-2.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Toggle Artículos / Catálogo de Manuscritos */}
        <div className="flex items-center gap-1 bg-accents-1 border border-accents-2 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => onChangeViewMode('articles')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              feedViewMode === 'articles'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            Artículos & Noticias ({totalArticlesCount})
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('manuscripts')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              feedViewMode === 'manuscripts'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            Catálogo de Manuscritos
          </button>
        </div>
      </div>

      {/* Fila 2: Categorías Temáticas y Regiones Geográficas */}
      {feedViewMode === 'articles' && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-accents-2/70 text-xs">
          {/* Filtro por Categoría */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] font-mono text-accents-4 mr-1">Sección:</span>
            {(
              [
                { id: 'all', label: 'Todos' },
                { id: 'recent_discoveries', label: 'Hallazgos en Tierra Santa' },
                { id: 'manuscripts_epigraphy', label: 'Manuscritos & Epigrafía' },
                { id: 'apologetics_reliability', label: 'Apologética & Historicidad' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChangeCategory(cat.id)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-foreground text-background font-semibold'
                    : 'text-accents-5 hover:text-foreground bg-accents-1/50 hover:bg-accents-1'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filtro por Región */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono text-accents-4 mr-1">Región:</span>
            <select
              value={selectedRegion}
              onChange={(e) => onChangeRegion(e.target.value as GeographicRegion)}
              className="bg-background border border-accents-2 rounded-md px-2 py-0.5 text-[11px] text-foreground focus:outline-none focus:border-foreground"
            >
              <option value="all">Todas las Regiones</option>
              <option value="jerusalem_judea">Jerusalén & Judea</option>
              <option value="galilee_samaria">Galilea & Samaria</option>
              <option value="jordan_dead_sea">Jordania & Mar Muerto</option>
              <option value="turkey_asia_minor">Turquía (Asia Menor)</option>
              <option value="greece_rome">Grecia & Roma</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
