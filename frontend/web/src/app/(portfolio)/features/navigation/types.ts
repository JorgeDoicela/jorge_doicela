export type PortfolioNavLabelKey =
  | 'home'
  | 'about'
  | 'projects'
  | 'stack'
  | 'experience'
  | 'engineering'
  | 'terminal'
  | 'contact';

export type PortfolioNavGroup = 'root' | 'overview' | 'engineering';

export type PortfolioNavIconName =
  | 'home'
  | 'user'
  | 'projects'
  | 'stack'
  | 'experience'
  | 'cloud'
  | 'terminal'
  | 'contact';

interface PortfolioNavItemBase {
  id: string;
  labelKey: PortfolioNavLabelKey;
  group: PortfolioNavGroup;
  icon: PortfolioNavIconName;
}

export interface PortfolioSectionNavItem extends PortfolioNavItemBase {
  kind: 'section';
  anchor: string;
}

export interface PortfolioRouteNavItem extends PortfolioNavItemBase {
  kind: 'route';
  href: string;
}

export type PortfolioNavItem = PortfolioSectionNavItem | PortfolioRouteNavItem;
