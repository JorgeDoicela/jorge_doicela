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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  prerequisites?: string;
  techStack: string;
  author: string;
  tags: string;
  coverImage?: string;
  views: number;
  likes: number;
  steps?: TutorialStep[];
  createdAt: string;
  updatedAt: string;
}
