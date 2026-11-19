export interface ForumPollOption {
  id: number;
  topicId: number;
  label: string;
  votes: number;
  displayOrder: number;
}

export interface ForumReply {
  id: number;
  topicId: number;
  parentId?: number | null;
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
  tags?: string;
  coverImage?: string;
  pollQuestion?: string;
  metaAlign?: string;
  isSolved: boolean;
  isPinned: boolean;
  repliesCount: number;
  views: number;
  orderPriority?: number;
  replies?: ForumReply[];
  pollOptions?: ForumPollOption[];
  createdAt: string;
  updatedAt: string;
}
