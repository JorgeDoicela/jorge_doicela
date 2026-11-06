import type { DoiceladevArticleCategory } from '../../shared/ui/ArticleCover';

export interface CategoryHubItem {
  slug: string;
  label: string;
  count: number;
  modules: DoiceladevArticleCategory[];
}

export interface CategoryArticleItem {
  id: string;
  href: string;
  title: string;
  category: DoiceladevArticleCategory;
  categoryMeta: string;
  coverImage?: string;
  excerpt?: string | null;
  date: string;
}

export interface CategoryArticlesResponse {
  category: {
    slug: string;
    label: string;
    totalCount: number;
  };
  articles: CategoryArticleItem[];
  page: number;
  limit: number;
  totalPages: number;
}

