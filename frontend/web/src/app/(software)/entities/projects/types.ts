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
  name: string;
  category: ProjectCategory;
  description: string;
  techStack: string;
  author: string;
  repoUrl?: string;
  liveUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  stars: number;
  views: number;
  orderPriority?: number;
  publishedAt?: string;
  coverImage?: string;
  architectureDiagramUrl?: string;
  createdAt: string;
  updatedAt: string;
}
