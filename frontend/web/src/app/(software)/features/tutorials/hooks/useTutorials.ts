'use client';

import { useState, useEffect } from 'react';
import { Tutorial } from '../types';
import { API_URL } from '../../../../config';

import { safeFetchJson } from '../../../../utils/fetchJson';

export function useTutorials(difficulty?: string, search: string = '') {
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

        const url = `${API_URL}/software/tutorials${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<any>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setTutorials(list);
      } catch (err: any) {
        console.error('Error al obtener tutoriales:', err);
        setError(err.message || 'No se pudieron cargar los tutoriales');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, [difficulty, search]);

  return { tutorials, loading, error };
}
