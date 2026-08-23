'use client';

import { useState, useEffect } from 'react';
import { SecurityPost } from '../types';
import { API_URL } from '../../../../config';

import { safeFetchJson } from '../../../../utils/fetchJson';

export function useCybersecurity(severity?: string, postType?: string, search: string = '') {
  const [posts, setPosts] = useState<SecurityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecurity = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (severity && severity !== 'all') params.append('severity', severity);
        if (postType && postType !== 'all') params.append('postType', postType);
        if (search.trim()) params.append('search', search.trim());

        const url = `${API_URL}/software/cybersecurity${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await safeFetchJson<any>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        setPosts(list);
      } catch (err: any) {
        console.error('Error al obtener posts de ciberseguridad:', err);
        setError(err.message || 'No se pudieron cargar los avisos de seguridad');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurity();
  }, [severity, postType, search]);

  return { posts, loading, error };
}
