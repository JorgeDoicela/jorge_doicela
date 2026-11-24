export type PortfolioNavLabelKey =
  | 'about'
  | 'projects'
  | 'stack'
  | 'experience'
  | 'engineering'
  | 'cloud'
  | 'tools'
  | 'philosophy'
  | 'terminal'
  | 'contact';

export type PortfolioNavGroup = 'overview' | 'engineering';

export type PortfolioNavIconName =
  | 'user'
  | 'projects'
  | 'stack'
  | 'experience'
  | 'cloud'
  | 'tools'
  | 'philosophy'
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
