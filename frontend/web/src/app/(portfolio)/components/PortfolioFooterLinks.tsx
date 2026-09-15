'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export function PortfolioFooterLinks() {
  const tNav = useTranslations('Nav');
  const [isLocal, setIsLocal] = useState(false);
  const [port, setPort] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsLocal(hostname.includes('localhost') || hostname.includes('127.0.0.1'));
      setPort(window.location.port ? `:${window.location.port}` : '');
    }
  }, []);

  const getSubdomainUrl = (subdomain: string) => {
    return isLocal
      ? `http://${subdomain}.localhost${port || ':3001'}`
      : `https://${subdomain}.jorgedoicela.com`;
  };

  const getLandingUrl = () => {
    return isLocal
      ? `http://localhost${port || ':3001'}`
      : 'https://jorgedoicela.com';
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-foreground/50 tracking-normal capitalize text-xs">
      <a
        href={getLandingUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gold-300 transition-colors"
      >
        {tNav('landing')}
      </a>
      <span>•</span>
      <a
        href={getSubdomainUrl('software')}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gold-300 transition-colors"
      >
        {tNav('software')}
      </a>
      <span>•</span>
      <a
        href={getSubdomainUrl('bible')}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gold-300 transition-colors"
      >
        {tNav('bible')}
      </a>
      <span>•</span>
      <a
        href="/llms.txt"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gold-300 transition-colors lowercase font-mono"
      >
        llms.txt
      </a>
    </div>
  );
}

export default PortfolioFooterLinks;
