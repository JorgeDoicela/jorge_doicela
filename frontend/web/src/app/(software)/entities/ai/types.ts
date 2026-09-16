export interface AiResource {
  id: number;
  slug: string;
  name: string;
  type: 'llm' | 'agent' | 'framework' | 'mcp_server' | 'tool';
  provider: string;
  description: string;
  contentMarkdown: string;
  license: string;
  documentationUrl?: string;
  paperUrl?: string;
  githubUrl?: string;
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
