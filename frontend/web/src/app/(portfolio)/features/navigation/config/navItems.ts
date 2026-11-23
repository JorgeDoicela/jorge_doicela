import type { PortfolioNavGroup, PortfolioNavItem } from '../types';

/**
 * Registro declarativo de navegación del Portafolio.
 * - kind: 'section' realiza scroll suave al ancla en / (o navega a /#anchor desde subpáginas).
 * - kind: 'route' navega a módulos o páginas dedicadas de Next.js (ej. /sandbox, /projects).
 */
export const PORTFOLIO_NAV_GROUPS: readonly PortfolioNavGroup[] = [
  'overview',
  'engineering',
] as const;

export const PORTFOLIO_NAV_ITEMS: readonly PortfolioNavItem[] = [
  { id: 'about', labelKey: 'about', group: 'overview', icon: 'user', kind: 'section', anchor: 'about' },
  { id: 'projects', labelKey: 'projects', group: 'overview', icon: 'projects', kind: 'section', anchor: 'projects' },
  { id: 'stack', labelKey: 'stack', group: 'overview', icon: 'stack', kind: 'section', anchor: 'stack' },
  { id: 'experience', labelKey: 'experience', group: 'overview', icon: 'experience', kind: 'section', anchor: 'experience' },
  { id: 'cloud', labelKey: 'cloud', group: 'engineering', icon: 'cloud', kind: 'section', anchor: 'cloud' },
  { id: 'tools', labelKey: 'tools', group: 'engineering', icon: 'tools', kind: 'section', anchor: 'tools' },
  { id: 'philosophy', labelKey: 'philosophy', group: 'engineering', icon: 'philosophy', kind: 'section', anchor: 'philosophy' },
  { id: 'terminal', labelKey: 'terminal', group: 'engineering', icon: 'terminal', kind: 'section', anchor: 'terminal' },
  { id: 'contact', labelKey: 'contact', group: 'engineering', icon: 'contact', kind: 'section', anchor: 'contact' },
] as const;

export const SIDENAV_STORAGE_KEY = 'portfolio_sidenav_collapsed';
