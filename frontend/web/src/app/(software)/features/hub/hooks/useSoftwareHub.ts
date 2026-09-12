'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { HubFeedItem, HubResponseData } from '../types';
import { API_URL } from '../../../../config';
import { safeFetchJson } from '../../../utils/fetchJson';

export function useSoftwareHub(search: string = '') {
  const locale = useLocale();
  const [featured, setFeatured] = useState<HubFeedItem[]>([]);
  const [feed, setFeed] = useState<HubFeedItem[]>([]);
  const [spotlightData, setSpotlightData] = useState<HubResponseData['spotlightData']>({
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
        const res = await safeFetchJson<any>(url);

        if (!isMounted) return;

        const payload = res?.data?.data || res?.data || res;
        const data: HubResponseData = payload || { featured: [], feed: [] };
        setFeatured(Array.isArray(data.featured) ? data.featured : []);
        setFeed(Array.isArray(data.feed) ? data.feed : []);
        if (data.spotlightData) {
          setSpotlightData(data.spotlightData);
        }
      } catch (err: any) {
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

        console.error('Error al cargar hub de software:', err);
        setError(err.message || 'No se pudo cargar el feed editorial');
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
