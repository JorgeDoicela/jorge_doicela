'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Project } from '../types';
import { API_URL } from '../../../../config';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useProjects(status?: string, search: string = '') {
  const locale = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (status && status !== 'all') params.append('status', status);
        if (search.trim()) params.append('search', search.trim());
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/software/projects${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<Project[] | { data: Project[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setProjects(list);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener proyectos:', msg);
        setError(msg || (locale === 'es' ? 'No se pudieron cargar los proyectos' : 'Failed to load projects'));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [status, search, locale]);

  return { projects, loading, error };
}
