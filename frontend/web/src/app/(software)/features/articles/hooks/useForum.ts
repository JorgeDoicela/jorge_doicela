'use client';

import { useState, useEffect } from 'react';
import { ForumTopic } from '../types';

export function useForum() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/software/forum`);

        if (!res.ok) {
          throw new Error('Error al cargar temas del foro');
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setTopics(list);
      } catch (err: any) {
        console.error('Error fetching forum topics:', err);
        setError(err.message || 'Error al conectar con los foros');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return { topics, loading, error };
}
