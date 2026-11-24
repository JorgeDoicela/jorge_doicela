export type StackCategoryType =
  | 'frontend'
  | 'backend'
  | 'data_devops'
  | 'ai_security'
  | 'tools';

export interface PortfolioStackItem {
  id: number;
  slug: string;
  language: string;
  category: StackCategoryType;
  name: string;
  level?: string | null;
  summary?: string | null;
  featured: boolean;
  orderIndex: number;
}
