'use client';

import { useState, useEffect } from 'react';
import { ForumTopic } from '../types';
import { API_URL } from '../../../../config';

export function useForum(category: string = 'all', search: string = '') {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (search.trim()) params.append('search', search.trim());

      const url = `${API_URL}/software/forum${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data || [];
      setTopics(list);
    } catch (err: any) {
      console.error('Error al obtener foros:', err);
      setError(err.message || 'No se pudieron cargar los temas del foro');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [category, search]);

  return { topics, loading, error, refetch: fetchTopics };
}
