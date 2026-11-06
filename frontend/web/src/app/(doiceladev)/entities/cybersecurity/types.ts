export type SecurityCategory =
  | 'advisory'
  | 'hardening_guide'
  | 'writeup'
  | 'cve_analysis'
  | 'pentest';

export interface SecurityPost {
  id: number;
  slug: string;
  title: string;
  category: SecurityCategory;
  cveId?: string;
  affectedSystems?: string;
  remediation?: string;
  excerpt: string;
  contentMarkdown: string;
  author: string;
  tags: string;
  coverImage?: string;
  views: number;
  likes: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
