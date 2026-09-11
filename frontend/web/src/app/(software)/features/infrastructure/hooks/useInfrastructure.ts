'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { InfrastructurePost } from '../types';
import { API_URL } from '../../../../config';
import { safeFetchJson } from '../../../utils/fetchJson';

export function useInfrastructure(
  category?: string,
  environment?: string,
  difficulty?: string,
  search: string = '',
) {
  const locale = useLocale();
  const [posts, setPosts] = useState<InfrastructurePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfrastructure = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (environment && environment !== 'all') params.append('environment', environment);
      if (difficulty && difficulty !== 'all') params.append('difficulty', difficulty);
      if (search.trim()) params.append('search', search.trim());
      if (locale) params.append('lang', locale);

      const url = `${API_URL}/software/infrastructure${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await safeFetchJson<InfrastructurePost[] | { data: InfrastructurePost[] }>(url);

      const list = Array.isArray(data) ? data : data.data || [];
      setPosts(list);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudieron cargar las guías de infraestructura';
      console.error('Error al obtener guías de infraestructura:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [category, environment, difficulty, search, locale]);

  useEffect(() => {
    fetchInfrastructure();
  }, [fetchInfrastructure]);

  return { posts, loading, error, refetch: fetchInfrastructure };
}
