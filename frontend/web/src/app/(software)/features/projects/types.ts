export interface Project {
  id: number;
  slug: string;
  name: string;
  description: string;
  techStack: string;
  repoUrl?: string;
  liveUrl?: string;
  status: 'active' | 'archived' | 'wip';
  featured: boolean;
  stars: number;
  views: number;
  architectureDiagramUrl?: string;
  createdAt: string;
  updatedAt: string;
}
