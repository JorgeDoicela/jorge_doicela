'use client';

import { useState, useEffect, useMemo } from 'react';

export interface SubdomainUrls {
  portfolio: string;
  kartex: string;
  doiceladev: string;
}

export function useSubdomainUrl() {
  const [resolved, setResolved] = useState({
    isLocal: false,
    protocol: 'https:',
    port: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      const protocol = window.location.protocol;
      if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        setResolved({ isLocal: true, protocol, port });
      }
    }
  }, []);

  const getSubdomainUrl = (subdomain: string) => {
    return resolved.isLocal
      ? `${resolved.protocol}//${subdomain}.localhost${resolved.port || ':3001'}`
      : `https://${subdomain}.jorgedoicela.com`;
  };

  const urls: SubdomainUrls = useMemo(() => ({
    portfolio: getSubdomainUrl('portfolio'),
    kartex: getSubdomainUrl('kartex'),
    doiceladev: getSubdomainUrl('doiceladev'),
  }), [resolved]);

  return { getSubdomainUrl, urls, isLocal: resolved.isLocal };
}
