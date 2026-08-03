export type SoftwareCategory = 'all' | 'news' | 'blog' | 'forum' | 'ai' | 'cybersecurity' | 'tutorial' | 'projects';

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'news' | 'blog' | 'ai' | 'cybersecurity' | 'tutorial';
  author: string;
  tags: string;
  coverImage?: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumTopic {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  category: string;
  repliesCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}
