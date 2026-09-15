'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function LandingFooterLinks() {
  const tLanding = useTranslations('Landing');
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

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-text-muted">
      <a
        href={getSubdomainUrl('portfolio')}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        {tLanding('portfolioHeadline')}
      </a>
      <span>•</span>
      <a
        href={getSubdomainUrl('software')}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        {tLanding('softwareHeadline')}
      </a>
      <span>•</span>
      <a
        href={getSubdomainUrl('bible')}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        {tLanding('bibleHeadline')}
      </a>
      <span>•</span>
      <Link href="/links" className="hover:text-foreground transition-colors">
        Links
      </Link>
      <span>•</span>
      <a
        href="/llms.txt"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors font-mono"
      >
        llms.txt
      </a>
    </div>
  );
}

export default LandingFooterLinks;
