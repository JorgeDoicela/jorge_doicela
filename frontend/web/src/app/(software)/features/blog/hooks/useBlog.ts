'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { API_URL } from '../../../../config';

export function useBlog(search: string = '', series?: string) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search.trim());
        if (series) params.append('series', series);

        const url = `${API_URL}/software/blog${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setPosts(list);
      } catch (err: any) {
        console.error('Error al obtener posts del blog:', err);
        setError(err.message || 'No se pudieron cargar los artículos del blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [search, series]);

  return { posts, loading, error };
}
