'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { InfrastructurePost } from '../types';
import { API_URL, useFuzzyFilter } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useInfrastructure(
  category?: string,
  search: string = '',
  sortBy?: string,
) {
  const locale = useLocale();
  const [rawPosts, setRawPosts] = useState<InfrastructurePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfrastructure = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (sortBy) params.append('sortBy', sortBy);
      if (locale) params.append('lang', locale);

      const url = `${API_URL}/doiceladev/infrastructure${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await safeFetchJson<InfrastructurePost[] | { data: InfrastructurePost[] }>(url);

      const list = Array.isArray(data) ? data : data.data || [];
      setRawPosts(list);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (locale === 'es' ? 'No se pudieron cargar las guías de infraestructura' : 'Failed to load infrastructure guides');
      console.error('Error al obtener guías de infraestructura:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [sortBy, locale]);

  useEffect(() => {
    fetchInfrastructure();
  }, [fetchInfrastructure]);

  const posts = useFuzzyFilter(rawPosts, {
    category,
    search,
    searchKeys: [
      { name: 'title', weight: 2.5 },
      { name: 'tags', weight: 1.8 },
      { name: 'category', weight: 1.2 },
      { name: 'subtitle', weight: 1.0 },
      { name: 'architectureOverview', weight: 0.8 },
    ],
  });

  return { posts, loading, error, refetch: fetchInfrastructure };
}
