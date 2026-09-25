export type BlogCategory =
  | 'architecture'
  | 'devops'
  | 'ai'
  | 'frontend'
  | 'backend'
  | 'career'
  | 'opinion'
  | 'databases';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  contentMarkdown: string;
  author: string;
  category: BlogCategory;
  tags: string;
  series?: string;
  tableOfContents?: string;
  coverImage?: string;
  views: number;
  likes: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
