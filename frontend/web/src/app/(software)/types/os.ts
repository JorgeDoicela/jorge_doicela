export interface DockItem {
  id: string;
  label: string;
  shortLabel: string;
  href: string;
  categoryNumber?: number;
  isAction?: boolean;
}

export interface SpotlightSearchResult {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  snippet: string;
  href: string;
  tag?: string;
}
