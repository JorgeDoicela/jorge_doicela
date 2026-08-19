'use client';

import { useState, useMemo } from 'react';
import { ARCHAEOLOGY_ARTICLES } from '../data/archaeologyArticles';
import { ANCIENT_MANUSCRIPTS } from '../data/ancientManuscripts';
import { ArticleCategory, GeographicRegion, ArchaeologyArticle } from '../types';

export function useArchaeologyFeed() {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<GeographicRegion>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [feedViewMode, setFeedViewMode] = useState<'articles' | 'manuscripts'>('articles');

  // Filtrado de artículos en memoria
  const filteredArticles = useMemo(() => {
    return ARCHAEOLOGY_ARTICLES.filter((article) => {
      // Filtro por categoría
      if (selectedCategory !== 'all' && article.category !== selectedCategory) {
        return false;
      }
      // Filtro por región
      if (selectedRegion !== 'all' && article.region !== selectedRegion) {
        return false;
      }
      // Filtro por búsqueda
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesSummary = article.summary.toLowerCase().includes(query);
        const matchesAuthor = article.institutionOrAuthor.toLowerCase().includes(query);
        const matchesTag = article.tags.some((t) => t.toLowerCase().includes(query));
        const matchesRef = article.biblicalReferences.some(
          (r) => r.reference.toLowerCase().includes(query) || r.context.toLowerCase().includes(query),
        );
        return matchesTitle || matchesSummary || matchesAuthor || matchesTag || matchesRef;
      }
      return true;
    });
  }, [selectedCategory, selectedRegion, searchQuery]);

  const activeArticle: ArchaeologyArticle | null = useMemo(() => {
    if (!activeArticleId) return null;
    return ARCHAEOLOGY_ARTICLES.find((a) => a.id === activeArticleId) || null;
  }, [activeArticleId]);

  return {
    articles: filteredArticles,
    allArticlesCount: ARCHAEOLOGY_ARTICLES.length,
    manuscripts: ANCIENT_MANUSCRIPTS,
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
  };
}
