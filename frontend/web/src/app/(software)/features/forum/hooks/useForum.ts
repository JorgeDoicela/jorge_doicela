'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { ForumTopic } from '../types';
import { API_URL } from '../../../../config';
import { safeFetchJson } from '../../../../utils/fetchJson';

export function useForum(category: string = 'all', search: string = '') {
  const locale = useLocale();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (search.trim()) params.append('search', search.trim());
      if (locale) params.append('lang', locale);

      const url = `${API_URL}/software/forum${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await safeFetchJson<any>(url);

      const list = Array.isArray(data) ? data : data.data || [];
      setTopics(list);
    } catch (err: any) {
      console.error('Error al obtener foros:', err);
      setError(err.message || 'No se pudieron cargar los temas del foro');
    } finally {
      setLoading(false);
    }
  }, [category, search, locale]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return { topics, loading, error, refetch: fetchTopics };
}
