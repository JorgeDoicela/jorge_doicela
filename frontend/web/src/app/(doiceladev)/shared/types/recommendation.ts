import type { DoiceladevArticleCategory } from '../ui/ArticleCover';

export interface RecommendationCard {
  id: string;
  href: string;
  title: string;
  category: DoiceladevArticleCategory;
  categoryMeta: string;
  coverImage?: string;
  excerpt?: string | null;
  score: number;
}
