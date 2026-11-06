'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { API_URL } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';
import type { CategoryArticlesResponse } from '../types';

export function useCategoryArticles(slug: string = 'all', search: string = '', page = 1) {
  const locale = useLocale();
  const [data, setData] = useState<CategoryArticlesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const activeSlug = slug.trim() || 'all';
        const params = new URLSearchParams({
          lang: locale || 'es',
          page: String(page),
          limit: '50',
        });
        if (search.trim()) {
          params.append('search', search.trim());
        }

        const url = `${API_URL}/doiceladev/categories/${encodeURIComponent(activeSlug)}?${params.toString()}`;
        const res = await safeFetchJson<CategoryArticlesResponse | { data: CategoryArticlesResponse }>(url);

        if (isMounted) {
          const payload = 'data' in res && res.data ? res.data : (res as CategoryArticlesResponse);
          setData(payload);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error al obtener artículos para la categoría '${slug}':`, msg);
        if (isMounted) {
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, [slug, search, locale, page]);

  return { data, loading, error };
}

