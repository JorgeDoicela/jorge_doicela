'use client';

import React from 'react';
import { useArchaeologyFeed } from '../hooks/useArchaeologyFeed';
import { FeedFilterBar } from './FeedFilterBar';
import { ArticleCard } from './ArticleCard';
import { ArticleReaderModal } from './ArticleReaderModal';

export const ArchaeologyFeedDashboard: React.FC = () => {
  const {
    articles,
    allArticlesCount,
    manuscripts,
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    setSelectedRegion,
    searchQuery,
    setSearchQuery,
    activeArticleId,
    setActiveArticleId,
    activeArticle,
    feedViewMode,
    setFeedViewMode,
  } = useArchaeologyFeed();

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Barra de Filtros y Búsqueda */}
      <FeedFilterBar
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
        selectedRegion={selectedRegion}
        onChangeRegion={setSelectedRegion}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        feedViewMode={feedViewMode}
        onChangeViewMode={setFeedViewMode}
        totalArticlesCount={allArticlesCount}
      />

      {/* Vista 1: Grilla de Artículos y Noticias Arqueológicas */}
      {feedViewMode === 'articles' && (
        <div>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onReadArticle={(id) => setActiveArticleId(id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-accents-2 rounded-xl text-accents-4 text-xs space-y-2">
              <p className="font-semibold text-foreground">No se encontraron artículos</p>
              <p>Intenta ajustar los filtros de región o los términos de búsqueda.</p>
            </div>
          )}
        </div>
      )}

      {/* Vista 2: Catálogo de Manuscritos Bíblicos Antiguos y Sellos */}
      {feedViewMode === 'manuscripts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {manuscripts.map((ms) => (
            <div
              key={ms.id}
              className="p-5 rounded-xl border border-accents-2 bg-background space-y-3 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
                    {ms.classification}
                  </span>
                  <span className="text-[10px] font-mono text-accents-4">
                    {ms.approximateDate}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-foreground leading-snug">{ms.name}</h3>
                <p className="text-xs text-accents-5 leading-relaxed">{ms.contentsOverview}</p>

                <div className="p-2.5 rounded-lg bg-accents-1/60 border border-accents-2 text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase text-accents-4 block">
                    Trascendencia:
                  </span>
                  <p className="text-foreground/90 text-[11px] leading-snug">{ms.importance}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-accents-2/70 text-[10px] font-mono text-accents-4 space-y-0.5">
                <div>Idioma: <span className="text-foreground">{ms.language}</span></div>
                <div>Custodia: <span className="text-foreground">{ms.currentLocation}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Lectura Profunda del Artículo */}
      <ArticleReaderModal
        article={activeArticle}
        onClose={() => setActiveArticleId(null)}
      />
    </div>
  );
};
