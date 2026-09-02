export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface PortfolioProject {
  id: number;
  slug: string;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  language: string;
  repoUrl?: string;
  demoUrl?: string;
  featured: boolean;
  overview?: string;
  challenge?: string;
  architectureHighlights?: string[];
  metrics?: { label: string; value: string }[];
  media?: ProjectMedia[];
}
