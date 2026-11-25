export type EngineeringDomainType = 'cloud' | 'security' | 'systems' | 'ai';

export interface EngineeringMetric {
  label: string;
  value: string;
}

export interface PortfolioEngineeringPillar {
  id: number;
  slug: string;
  language: string;
  domain: EngineeringDomainType;
  title: string;
  badge?: string | null;
  summary: string;
  details?: string[];
  metrics?: EngineeringMetric[];
  technologies?: string[];
  featured: boolean;
  orderIndex: number;
}
