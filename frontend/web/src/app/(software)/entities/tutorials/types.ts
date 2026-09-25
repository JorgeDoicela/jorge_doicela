export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TutorialCategory =
  | 'web'
  | 'backend'
  | 'devops'
  | 'mobile'
  | 'ai'
  | 'databases'
  | 'security'
  | 'architecture';

export interface TutorialStep {
  id: number;
  tutorialId: number;
  stepOrder: number;
  title: string;
  contentMarkdown: string;
  codeSnippet?: string;
  codeLanguage: string;
  imageUrl?: string;
}

export interface Tutorial {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: TutorialCategory;
  difficulty: TutorialDifficulty;
  prerequisites?: string;
  techStack: string;
  author: string;
  tags: string;
  coverImage?: string;
  views: number;
  likes: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt?: string;
  steps?: TutorialStep[];
  createdAt: string;
  updatedAt: string;
}
