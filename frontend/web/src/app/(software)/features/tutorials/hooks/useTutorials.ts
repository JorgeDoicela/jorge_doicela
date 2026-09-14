'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Tutorial } from '../types';
import { API_URL } from '../../../../config';
import { safeFetchJson } from '../../../utils/fetchJson';

export function useTutorials(difficulty?: string, search: string = '') {
  const locale = useLocale();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorials = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (difficulty && difficulty !== 'all') params.append('difficulty', difficulty);
        if (search.trim()) params.append('search', search.trim());
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/software/tutorials${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<Tutorial[] | { data: Tutorial[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setTutorials(list);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener tutoriales:', msg);
        setError(msg || (locale === 'es' ? 'No se pudieron cargar los tutoriales' : 'Failed to load tutorials'));
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, [difficulty, search, locale]);

  return { tutorials, loading, error };
}
