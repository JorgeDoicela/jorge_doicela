'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Project } from '../types';
import { API_URL, useFuzzyFilter } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useProjects(
  category?: string,
  search: string = '',
  status?: string,
) {
  const locale = useLocale();
  const [rawProjects, setRawProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/doiceladev/projects${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<Project[] | { data: Project[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setRawProjects(list);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener proyectos:', msg);
        setError(msg || (locale === 'es' ? 'No se pudieron cargar los proyectos' : 'Failed to load projects'));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [locale]);

  // Pre-filtrado opcional por status si está definido
  const statusFiltered = useMemo(() => {
    if (!status || status === 'all') return rawProjects;
    const sLower = status.trim().toLowerCase();
    return rawProjects.filter((p) => p.status?.toLowerCase() === sLower);
  }, [rawProjects, status]);

  const projects = useFuzzyFilter(statusFiltered, {
    category,
    search,
    searchKeys: [
      { name: 'name', weight: 2.5 },
      { name: 'techStack', weight: 1.8 },
      { name: 'category', weight: 1.2 },
      { name: 'description', weight: 0.8 },
    ],
  });

  return { projects, loading, error };
}
