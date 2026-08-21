export interface SecurityPost {
  id: number;
  slug: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  postType: 'advisory' | 'hardening_guide' | 'writeup';
  cveId?: string;
  affectedSystems?: string;
  remediation?: string;
  excerpt: string;
  contentMarkdown: string;
  author: string;
  tags: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}
