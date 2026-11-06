import type { DoiceladevArticleCategory } from '../../shared/ui/ArticleCover';

export interface TagHubItem {
  id: number;
  slug: string;
  label: string;
  count: number;
}

export interface TagArticleItem {
  id: string;
  href: string;
  title: string;
  category: DoiceladevArticleCategory;
  categoryMeta: string;
  coverImage?: string;
  excerpt?: string | null;
  date: string;
}

export interface TagArticlesResponse {
  tag: {
    slug: string;
    label: string;
    totalCount: number;
  };
  articles: TagArticleItem[];
  page: number;
  limit: number;
  totalPages: number;
}

