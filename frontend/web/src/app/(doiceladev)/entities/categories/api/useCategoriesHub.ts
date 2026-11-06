'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { API_URL } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';
import type { CategoryHubItem } from '../types';

export function useCategoriesHub() {
  const locale = useLocale();
  const [categories, setCategories] = useState<CategoryHubItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_URL}/doiceladev/categories?lang=${locale}`;
        const data = await safeFetchJson<CategoryHubItem[] | { data: CategoryHubItem[] }>(url);

        if (isMounted) {
          const list = Array.isArray(data) ? data : data?.data || [];
          setCategories(list);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener catálogo de categorías:', msg);
        if (isMounted) {
          setError(msg);
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

