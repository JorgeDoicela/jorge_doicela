'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { FilterOption } from '../../../shared';
import { API_URL } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useAiCategories() {
  const locale = useLocale();
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_URL}/software/ai/categories?lang=${locale}`;
        const data = await safeFetchJson<FilterOption[] | { data: FilterOption[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        if (isMounted) {
          setCategories(list);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener categorías de IA:', msg);
        if (isMounted) {
          setError(
            msg ||
              (locale === 'es'
                ? 'No se pudieron cargar los tipos de recursos de IA'
                : 'Failed to load AI resource types'),
          );
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
