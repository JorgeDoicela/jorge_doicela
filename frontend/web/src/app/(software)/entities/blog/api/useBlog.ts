'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { BlogPost } from '../types';
import { API_URL } from '../../../../config';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useBlog(search: string = '', series?: string) {
  const locale = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search.trim());
        if (series) params.append('series', series);
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/software/blog${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<BlogPost[] | { data: BlogPost[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setPosts(list);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener artículos del blog:', msg);
        setError(msg || (locale === 'es' ? 'No se pudieron cargar los artículos del blog' : 'Failed to load blog posts'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [search, series, locale]);

  return { posts, loading, error };
}
