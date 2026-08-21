export interface ForumReply {
  id: number;
  topicId: number;
  parentId?: number;
  author: string;
  content: string;
  isAcceptedAnswer: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumTopic {
  id: number;
  slug: string;
  title: string;
  content: string;
  author: string;
  category: string;
  isSolved: boolean;
  isPinned: boolean;
  repliesCount: number;
  views: number;
  replies?: ForumReply[];
  createdAt: string;
  updatedAt: string;
}
