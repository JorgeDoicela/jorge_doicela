'use client';

import { useState, useEffect } from 'react';
import { AiResource } from '../types';
import { API_URL } from '../../../../config';

export function useAi(type?: string, search: string = '') {
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

        const url = `${API_URL}/software/ai${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setResources(list);
      } catch (err: any) {
        console.error('Error al obtener recursos de IA:', err);
        setError(err.message || 'No se pudieron cargar los modelos y agentes de IA');
      } finally {
        setLoading(false);
      }
    };

    fetchAi();
  }, [type, search]);

  return { resources, loading, error };
}
