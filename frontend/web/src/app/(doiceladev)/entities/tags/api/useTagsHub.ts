'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { API_URL } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';
import type { TagHubItem } from '../types';

export function useTagsHub() {
  const locale = useLocale();
  const [tags, setTags] = useState<TagHubItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTags = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_URL}/doiceladev/tags?lang=${locale}`;
        const data = await safeFetchJson<TagHubItem[] | { data: TagHubItem[] }>(url);

        if (isMounted) {
          const list = Array.isArray(data) ? data : data?.data || [];
          setTags(list);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error al obtener catálogo de tags:', msg);
        if (isMounted) {
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTags();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return { tags, loading, error };
}

