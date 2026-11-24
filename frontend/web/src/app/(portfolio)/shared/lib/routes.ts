/**
 * Utilidades puras de clasificación de rutas del subdominio Portfolio.
 * Soporta tanto acceso por subdominio (portfolio.* -> /about) como acceso directo (/portfolio/about).
 */
export function isPortfolioHomePath(pathname: string): boolean {
  return pathname === '/' || pathname === '/portfolio';
}

export function isPortfolioSandboxPath(pathname: string): boolean {
  return pathname.startsWith('/sandbox') || pathname.startsWith('/portfolio/sandbox');
}

export function getPortfolioHomeHref(pathname: string): string {
  return pathname.startsWith('/portfolio/') ? '/portfolio' : '/';
}
