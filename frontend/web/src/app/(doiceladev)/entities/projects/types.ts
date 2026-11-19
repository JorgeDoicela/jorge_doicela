export type ProjectStatus = 'active' | 'archived' | 'wip';
export type ProjectCategory =
  | 'web'
  | 'backend'
  | 'mobile'
  | 'devops'
  | 'ai'
  | 'open_source'
  | 'tool';

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: ProjectCategory;
  excerpt: string;
  contentMarkdown: string;
  techStack: string;
  tags: string;
  author: string;
  repoUrl?: string;
  liveUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  metaAlign?: string;
  stars: number;
  views: number;
  likes: number;
  orderPriority?: number;
  publishedAt: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}
