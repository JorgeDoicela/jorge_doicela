export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  contentMarkdown: string;
  author: string;
  tags: string;
  series?: string;
  tableOfContents?: string;
  coverImage?: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}
