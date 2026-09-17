'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { FilterOption } from '../../../shared';
import { API_URL } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useInfrastructureCategories() {
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
        const url = `${API_URL}/software/infrastructure/categories?lang=${locale}`;
        const data = await safeFetchJson<FilterOption[] | { data: FilterOption[] }>(url);

        const list = Array.isArray(data) ? data : data.data || [];
        if (isMounted) {
          setCategories(list);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener categorías de infraestructura:', msg);
        if (isMounted) {
          setError(
            msg ||
              (locale === 'es'
                ? 'No se pudieron cargar las categorías de infraestructura'
                : 'Failed to load infrastructure categories'),
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
