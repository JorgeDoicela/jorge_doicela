'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { NewsArticle } from '../types';
import { API_URL, useFuzzyFilter } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useNews(category: string = 'all', search: string = '') {
  const locale = useLocale();
  const [rawNews, setRawNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/doiceladev/news${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<NewsArticle[] | { data: NewsArticle[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setRawNews(list);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener noticias:', msg);
        setError(msg || (locale === 'es' ? 'No se pudieron cargar las noticias' : 'Failed to load news'));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [locale]);

  const news = useFuzzyFilter(rawNews, {
    category,
    search,
    searchKeys: [
      { name: 'title', weight: 2.5 },
      { name: 'tags', weight: 1.8 },
      { name: 'category', weight: 1.2 },
      { name: 'excerpt', weight: 0.8 },
    ],
  });

  return { news, loading, error };
}
