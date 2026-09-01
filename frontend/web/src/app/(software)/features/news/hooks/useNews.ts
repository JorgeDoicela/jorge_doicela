'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { NewsArticle } from '../types';
import { API_URL } from '../../../../config';
import { safeFetchJson } from '../../../utils/fetchJson';

export function useNews(search: string = '', tag?: string) {
  const locale = useLocale();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search.trim());
        if (tag) params.append('tag', tag);
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/software/news${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<any>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setNews(list);
      } catch (err: any) {
        console.error('Error al obtener noticias:', err);
        setError(err.message || 'No se pudieron cargar las noticias');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [search, tag, locale]);

  return { news, loading, error };
}
