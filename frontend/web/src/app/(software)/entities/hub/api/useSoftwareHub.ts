'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { HubFeedItem, HubResponseData, HubSpotlightData } from '../types';
import { API_URL } from '../../../shared';
import { safeFetchJson } from '../../../shared/lib/fetchJson';

export function useSoftwareHub(search: string = '') {
  const locale = useLocale();
  const [featured, setFeatured] = useState<HubFeedItem[]>([]);
  const [feed, setFeed] = useState<HubFeedItem[]>([]);
  const [spotlightData, setSpotlightData] = useState<HubSpotlightData>({
    news: [],
    posts: [],
    topics: [],
    aiResources: [],
    secPosts: [],
    tutorials: [],
    projects: [],
    infraPosts: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const refetch = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let isMounted = true;
    let retryTimer: NodeJS.Timeout | null = null;

    const fetchHub = async (isRetry = false) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search.trim());
        if (locale) params.append('lang', locale);

        const url = `${API_URL}/software/hub${params.toString() ? `?${params.toString()}` : ''}`;
        const res = await safeFetchJson<HubResponseData | { data: HubResponseData }>(url);

        if (!isMounted) return;

        const isWrapped = (r: HubResponseData | { data: HubResponseData }): r is { data: HubResponseData } =>
          'data' in r && r.data !== null && typeof r.data === 'object';
        const data: HubResponseData = isWrapped(res)
          ? res.data
          : (res as HubResponseData);
        setFeatured(Array.isArray(data.featured) ? data.featured : []);
        setFeed(Array.isArray(data.feed) ? data.feed : []);
        if (data.spotlightData) {
          setSpotlightData(data.spotlightData);
        }
      } catch (err: unknown) {
        if (!isMounted) return;

        // Auto-reintento único defensivo ante carrera de arranque o fallo transitorio de conexión
        if (!isRetry) {
          retryTimer = setTimeout(() => {
            if (isMounted) {
              fetchHub(true);
            }
          }, 1500);
          return;
        }

        const msg = err instanceof Error ? err.message : String(err);
        console.warn('Aviso de conexión al hub de software:', msg);
        setError(msg || (locale === 'es' ? 'No se pudo cargar el feed editorial' : 'Failed to load editorial feed'));
      } finally {
        if (isMounted && !retryTimer) {
          setLoading(false);
        }
      }
    };

    fetchHub();

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [search, locale, reloadTrigger]);

  return { featured, feed, spotlightData, loading, error, refetch };
}
