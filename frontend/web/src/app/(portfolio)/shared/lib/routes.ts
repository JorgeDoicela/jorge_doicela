/**
 * Utilidades puras de clasificación y resolución de rutas del subdominio Portfolio.
 * Soporta tanto acceso por subdominio (portfolio.* -> /about) como acceso directo (/portfolio/about).
 */
export function isPortfolioPrefixedPath(pathname: string): boolean {
  return pathname === '/portfolio' || pathname.startsWith('/portfolio/');
}

export function isPortfolioHomePath(pathname: string): boolean {
  return pathname === '/' || pathname === '/portfolio';
}

export function isPortfolioSandboxPath(pathname: string): boolean {
  return pathname.startsWith('/sandbox') || pathname.startsWith('/portfolio/sandbox');
}

export function getPortfolioHomeHref(pathname: string): string {
  return isPortfolioPrefixedPath(pathname) ? '/portfolio' : '/';
}

export function resolvePortfolioHref(pathname: string, route: string): string {
  const normalized = route.startsWith('/') ? route : `/${route}`;
  if (isPortfolioPrefixedPath(pathname)) {
    return normalized === '/' ? '/portfolio' : `/portfolio${normalized}`;
  }
  return normalized;
}
