'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useSubdomainUrl } from '../../../shared/lib';

export function ActionLinksList() {
  const t = useTranslations('Links');
  const { getSubdomainUrl } = useSubdomainUrl();

  const links = [
    {
      id: 'kartex',
      text: t('kartexTitle'),
      href: getSubdomainUrl('kartex'),
      isExternal: true,
    },
    {
      id: 'doiceladev',
      text: t('doiceladevTitle'),
      href: getSubdomainUrl('doiceladev'),
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
