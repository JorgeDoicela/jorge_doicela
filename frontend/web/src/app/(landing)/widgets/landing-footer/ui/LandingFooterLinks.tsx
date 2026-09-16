'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSubdomainUrl } from '../../../shared/lib';

export function LandingFooterLinks() {
  const tLanding = useTranslations('Landing');
  const { urls } = useSubdomainUrl();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-text-muted">
      <a
        href={urls.portfolio}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        {tLanding('portfolioHeadline')}
      </a>
      <span>•</span>
      <a
        href={urls.software}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        {tLanding('softwareHeadline')}
      </a>
      <span>•</span>
      <a
        href={urls.bible}
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
