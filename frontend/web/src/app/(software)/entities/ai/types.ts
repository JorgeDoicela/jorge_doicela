export type AiCategory =
  | 'llm'
  | 'agent'
  | 'framework'
  | 'mcp_server'
  | 'tool'
  | 'dataset'
  | 'platform';

export interface AiResource {
  id: number;
  slug: string;
  name: string;
  category: AiCategory;
  provider: string;
  description: string;
  contentMarkdown: string;
  license: string;
  documentationUrl?: string;
  paperUrl?: string;
  githubUrl?: string;
  tags: string;
  author: string;
  coverImage?: string;
  views: number;
  likes: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
