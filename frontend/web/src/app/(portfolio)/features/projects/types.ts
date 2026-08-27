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
}
