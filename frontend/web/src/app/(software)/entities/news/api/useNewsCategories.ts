'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { NewsCategoryItem } from '../types';
import { API_URL } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useNewsCategories() {
  const locale = useLocale();
  const [categories, setCategories] = useState<NewsCategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_URL}/software/news/categories?lang=${locale}`;
        const data = await safeFetchJson<NewsCategoryItem[] | { data: NewsCategoryItem[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        if (isMounted) {
          setCategories(list);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener categorías de noticias:', msg);
        if (isMounted) {
          setError(msg || (locale === 'es' ? 'No se pudieron cargar las categorías' : 'Failed to load categories'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return { categories, loading, error };
}
