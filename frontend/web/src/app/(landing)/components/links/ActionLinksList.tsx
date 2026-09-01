'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function ActionLinksList() {
  const t = useTranslations('Links');
  const [isLocal, setIsLocal] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsLocal(hostname.includes('localhost') || hostname.includes('127.0.0.1'));
    }
  }, []);

  const getSubdomainUrl = (subdomain: string) => {
    return isLocal
      ? `http://${subdomain}.localhost:3001`
      : `https://${subdomain}.jorgedoicela.com`;
  };

  const links = [
    {
      id: 'bible',
      text: t('bibleTitle'),
      href: getSubdomainUrl('bible'),
      isExternal: true,
    },
    {
      id: 'software',
      text: t('softwareTitle'),
      href: getSubdomainUrl('software'),
      isExternal: true,
    },
    {
      id: 'portfolio',
      text: t('portfolioTitle'),
      href: getSubdomainUrl('portfolio'),
      isExternal: true,
    },
    {
      id: 'cv',
      text: t('actionCv'),
      href: getSubdomainUrl('portfolio'),
      isExternal: true,
    },
    {
      id: 'consulta',
      text: t('consultaTitle'),
      href: '/consulta',
      isExternal: false,
    }
  ];

  return (
    <section className="w-full space-y-3 md:space-y-3.5 mb-8">
      {links.map((link) => {
        const buttonClass =
          'block w-full py-4 px-6 md:py-4.5 md:px-8 rounded-2xl text-center font-bold tracking-tight text-foreground bg-card border border-card-border hover:border-card-hover-border hover:bg-foreground/[0.04] shadow-sm backdrop-blur-xl transition-all duration-200 hover:scale-[1.012] active:scale-[0.988] cursor-pointer text-sm md:text-base font-outfit';

        return link.isExternal ? (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            {link.text}
          </a>
        ) : (
          <Link
            key={link.id}
            href={link.href}
            className={buttonClass}
          >
            {link.text}
          </Link>
        );
      })}
    </section>
  );
}
