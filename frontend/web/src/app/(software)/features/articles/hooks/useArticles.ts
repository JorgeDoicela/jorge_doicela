'use client';

import { useState, useEffect } from 'react';
import { Article, SoftwareCategory } from '../types';

export function useArticles(category: SoftwareCategory, search: string) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si la categoría seleccionada es 'forum' o 'projects', no consultamos el endpoint de artículos
    if (category === 'forum' || category === 'projects') {
      setArticles([]);
      setLoading(false);
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const params = new URLSearchParams();

        if (category !== 'all') {
          params.append('category', category);
        }
        if (search.trim()) {
          params.append('search', search.trim());
        }

        const url = `${baseUrl}/software/articles${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Error en la petición: ${res.statusText}`);
        }

        const data = await res.json();
        // Soportar respuestas envueltas por TransformInterceptor ({ success: true, data: [...] }) o directas
        const list = Array.isArray(data) ? data : data.data || [];
        setArticles(list);
      } catch (err: any) {
        console.error('Error al obtener los artículos:', err);
        setError(err.message || 'No se pudieron cargar los artículos');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, search]);

  return { articles, loading, error };
}
