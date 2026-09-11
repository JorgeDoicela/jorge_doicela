export type InfrastructureCategory =
  | 'cloud'
  | 'servers'
  | 'containers'
  | 'networking'
  | 'ci_cd'
  | 'hardening'
  | 'zero_ram';

export type InfrastructureEnvironment =
  | 'production'
  | 'edge'
  | 'hybrid'
  | 'vps'
  | 'bare_metal';

export type InfrastructureDifficulty =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';

export interface InfrastructureSpecs {
  ram?: string;
  cpu?: string;
  os?: string;
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
  subtitle?: string;
  category: InfrastructureCategory;
  environment: InfrastructureEnvironment;
  difficulty: InfrastructureDifficulty;
  techStack: string;
  architectureOverview?: string;
  specs?: string;
  contentMarkdown: string;
  author: string;
  tags: string;
  language: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface InfrastructureFilter {
  category?: InfrastructureCategory | 'all';
  environment?: InfrastructureEnvironment | 'all';
  difficulty?: InfrastructureDifficulty | 'all';
  search?: string;
}
