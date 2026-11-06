'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { AiResource } from '../types';
import { API_URL, useFuzzyFilter } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useAi(category?: string, search: string = '') {
  const locale = useLocale();
  const [rawResources, setRawResources] = useState<AiResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAi = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/doiceladev/ai${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<AiResource[] | { data: AiResource[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setRawResources(list);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener recursos de IA:', msg);
        setError(msg || (locale === 'es' ? 'No se pudieron cargar los modelos y agentes de IA' : 'Failed to load AI models and agents'));
      } finally {
        setLoading(false);
      }
    };

    fetchAi();
  }, [locale]);

  const resources = useFuzzyFilter(rawResources, {
    category,
    search,
    searchKeys: [
      { name: 'name', weight: 2.5 },
      { name: 'title', weight: 2.5 },
      { name: 'tags', weight: 1.8 },
      { name: 'category', weight: 1.2 },
      { name: 'description', weight: 0.8 },
    ],
  });

  return { resources, loading, error };
}
