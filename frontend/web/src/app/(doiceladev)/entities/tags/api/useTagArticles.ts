'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { API_URL } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';
import type { TagArticlesResponse } from '../types';

export function useTagArticles(slug: string = 'all', search: string = '', page = 1) {
  const locale = useLocale();
  const [data, setData] = useState<TagArticlesResponse | null>(null);
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

        const url = `${API_URL}/doiceladev/tags/${encodeURIComponent(activeSlug)}?${params.toString()}`;
        const res = await safeFetchJson<TagArticlesResponse | { data: TagArticlesResponse }>(url);

        if (isMounted) {
          const payload = 'data' in res && res.data ? res.data : (res as TagArticlesResponse);
          setData(payload);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error al obtener artículos para el tag '${slug}':`, msg);
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

