'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { AiResource } from '../types';
import { API_URL } from '../../../../config';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useAi(type?: string, search: string = '') {
  const locale = useLocale();
  const [resources, setResources] = useState<AiResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAi = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (type && type !== 'all') params.append('type', type);
        if (search.trim()) params.append('search', search.trim());
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/software/ai${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<AiResource[] | { data: AiResource[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setResources(list);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener recursos de IA:', msg);
        setError(msg || (locale === 'es' ? 'No se pudieron cargar los modelos y agentes de IA' : 'Failed to load AI models and agents'));
      } finally {
        setLoading(false);
      }
    };

    fetchAi();
  }, [type, search, locale]);

  return { resources, loading, error };
}
