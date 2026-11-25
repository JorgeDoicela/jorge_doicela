'use client';

import React from 'react';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { resolvePortfolioHref } from '../lib/routes';

type PortfolioLinkProps = Omit<LinkProps, 'href'> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
  };

/**
 * Enlace interno del dominio Portfolio con resolución automática para
 * subdominio (portfolio.* -> /about) y acceso directo (/portfolio -> /portfolio/about),
 * preservando el renderizado SSR/ISR en las páginas servidoras.
 */
export function PortfolioLink({ href, ...props }: PortfolioLinkProps) {
  const pathname = usePathname();
  const resolvedHref = resolvePortfolioHref(pathname, href);

  return <Link href={resolvedHref} {...props} />;
}
