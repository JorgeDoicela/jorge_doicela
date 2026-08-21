'use client';

import { useState, useEffect } from 'react';
import { Project } from '../types';
import { API_URL } from '../../../../config';

export function useProjects(status?: string, search: string = '') {
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

        const url = `${API_URL}/software/projects${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setProjects(list);
      } catch (err: any) {
        console.error('Error al obtener proyectos:', err);
        setError(err.message || 'No se pudieron cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [status, search]);

  return { projects, loading, error };
}
