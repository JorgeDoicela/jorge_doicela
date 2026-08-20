'use client';

import { useState, useMemo, useEffect } from 'react';
import { ArticleCategory, GeographicRegion, ArchaeologyArticle, AncientManuscript } from '../types';
import { fetchArchaeologyArticles } from '../services/archaeologyApiService';

export function useArchaeologyFeed() {
  const [articles, setArticles] = useState<ArchaeologyArticle[]>([]);
  const [manuscripts, setManuscripts] = useState<AncientManuscript[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<GeographicRegion>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [feedViewMode, setFeedViewMode] = useState<'articles' | 'manuscripts'>('articles');

  useEffect(() => {
    let active = true;
    const loadArticles = async () => {
      setLoading(true);
      try {
        const data = await fetchArchaeologyArticles(selectedCategory, searchQuery);
        if (active) setArticles(data);
      } catch {
        if (active) setArticles([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadArticles();
    return () => {
      active = false;
    };
  }, [selectedCategory, searchQuery]);

  // Filtrado de artículos por región
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (selectedRegion !== 'all' && article.region !== selectedRegion) {
        return false;
      }
      return true;
    });
  }, [articles, selectedRegion]);

  const activeArticle: ArchaeologyArticle | null = useMemo(() => {
    if (!activeArticleId) return null;
    return articles.find((a) => a.id === activeArticleId) || null;
  }, [articles, activeArticleId]);

  return {
    loading,
    articles: filteredArticles,
    allArticlesCount: articles.length,
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
  };
}
