'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { BlogPost } from '../types';
import { API_URL, useFuzzyFilter } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useBlog(category: string = 'all', search: string = '', series?: string) {
  const locale = useLocale();
  const [rawPosts, setRawPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (series) params.append('series', series);
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/doiceladev/blog${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<BlogPost[] | { data: BlogPost[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setRawPosts(list);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener artículos del blog:', msg);
        setError(msg || (locale === 'es' ? 'No se pudieron cargar los artículos del blog' : 'Failed to load blog posts'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [series, locale]);

  const posts = useFuzzyFilter(rawPosts, {
    category,
    search,
    searchKeys: [
      { name: 'title', weight: 2.5 },
      { name: 'tags', weight: 1.8 },
      { name: 'category', weight: 1.2 },
      { name: 'series', weight: 1.0 },
      { name: 'excerpt', weight: 0.8 },
    ],
  });

  return { posts, loading, error };
}
