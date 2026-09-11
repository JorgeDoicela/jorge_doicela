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

  useEffect(() => {
    let isMounted = true;

    const fetchHub = async () => {
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
        console.error('Error al cargar hub de software:', err);
        setError(err.message || 'No se pudo cargar el feed editorial');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHub();

    return () => {
      isMounted = false;
    };
  }, [search, locale]);

  return { featured, feed, spotlightData, loading, error };
}
