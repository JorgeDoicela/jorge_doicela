import type { PortfolioNavGroup, PortfolioNavItem } from '../types';

/**
 * Registro declarativo de navegación del Portafolio (7 ejes atemporales).
 * - kind: 'route' navega a páginas dedicadas respaldadas por portfolio.sqlite (/about, /projects, /stack, /experience, /engineering).
 * - kind: 'section' realiza scroll suave al ancla interactiva en el Home (/terminal, /contact).
 */
export const PORTFOLIO_NAV_GROUPS: readonly PortfolioNavGroup[] = [
    'overview',
    'engineering',
] as const;

export const PORTFOLIO_NAV_ITEMS: readonly PortfolioNavItem[] = [
    { id: 'about', labelKey: 'about', group: 'overview', icon: 'user', kind: 'route', href: '/about' },
    { id: 'projects', labelKey: 'projects', group: 'overview', icon: 'projects', kind: 'route', href: '/projects' },
    { id: 'stack', labelKey: 'stack', group: 'overview', icon: 'stack', kind: 'route', href: '/stack' },
    { id: 'experience', labelKey: 'experience', group: 'overview', icon: 'experience', kind: 'route', href: '/experience' },
    { id: 'engineering', labelKey: 'engineering', group: 'engineering', icon: 'cloud', kind: 'route', href: '/engineering' },
    { id: 'terminal', labelKey: 'terminal', group: 'engineering', icon: 'terminal', kind: 'route', href: '/terminal' },
    { id: 'contact', labelKey: 'contact', group: 'engineering', icon: 'contact', kind: 'section', anchor: 'contact' },
] as const;

export const SIDENAV_STORAGE_KEY = 'portfolio_sidenav_collapsed';
