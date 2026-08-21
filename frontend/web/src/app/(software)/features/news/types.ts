export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  sourceUrl?: string;
  isBreaking: boolean;
  author: string;
  tags: string;
  coverImage?: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
