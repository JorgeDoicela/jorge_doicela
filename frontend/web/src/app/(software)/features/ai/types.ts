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
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}
