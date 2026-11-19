export type InfrastructureCategory =
  | 'cloud'
  | 'servers'
  | 'containers'
  | 'networking'
  | 'ci_cd'
  | 'hardening'
  | 'zero_ram'
  | 'monitoring'
  | 'security';

export interface InfrastructureSpecs {
  ram?: string;
  cpu?: string;
  os?: string;
  kernel?: string;
  engine?: string;
  storage?: string;
  ports?: string;
  networkPolicy?: string;
  mTLS?: string;
  rateLimits?: string;
  memoryCost?: string;
  cgroups?: string;
  socketPerms?: string;
  containerMemory?: string;
  isolation?: string;
  buildRunner?: string;
  transfer?: string;
  downtime?: string;
  vpsRamUsedDuringDeploy?: string;
  initSystem?: string;
  logDaemon?: string;
  watchdog?: string;
  [key: string]: string | undefined;
}

export interface InfrastructurePost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: InfrastructureCategory;
  techStack: string;
  specs?: string;
  contentMarkdown: string;
  author: string;
  tags: string;
  language: string;
  metaAlign?: string;
  coverImage?: string;
  views: number;
  likes: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type InfrastructureSortBy = 'smart' | 'recent' | 'popular';

export interface InfrastructureFilter {
  category?: InfrastructureCategory | 'all';
  search?: string;
  sortBy?: InfrastructureSortBy;
}
