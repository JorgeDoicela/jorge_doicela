export type ExperienceType = 'work' | 'education';

export interface PortfolioExperienceItem {
  id: number;
  slug: string;
  language: string;
  type: ExperienceType;
  title: string;
  subtitle: string;
  period?: string | null;
  companyUrl?: string | null;
  description: string;
  highlights?: string[];
  technologies?: string[];
  featured: boolean;
  orderIndex: number;
}
