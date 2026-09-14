import { NewsArticle } from '../../news/entities/news-article.entity';
import { BlogPost } from '../../blog/entities/blog-post.entity';
import { SecurityPost } from '../../cybersecurity/entities/security-post.entity';
import { Tutorial } from '../../tutorials/entities/tutorial.entity';
import { InfrastructurePost } from '../../infrastructure/entities/infrastructure-post.entity';
import { AiResource } from '../../ai/entities/ai-resource.entity';
import { Project } from '../../projects/entities/project.entity';
import { ForumTopic } from '../../forum/entities/forum-topic.entity';

export interface HubFeedItem {
  id: string;
  href: string;
  title: string;
  category:
    | 'news'
    | 'blog'
    | 'ai'
    | 'cybersecurity'
    | 'tutorials'
    | 'projects'
    | 'infrastructure'
    | 'forum';
  subCategory?: string;
  coverImage?: string;
  tag?: string;
  categoryMeta: string;
  excerpt?: string | null;
  accentHoverColor?: string;
  date: string;
  smartScore: number;
}

export interface HubSpotlightData {
  news: NewsArticle[];
  posts: BlogPost[];
  topics: ForumTopic[];
  aiResources: AiResource[];
  secPosts: SecurityPost[];
  tutorials: Tutorial[];
  projects: Project[];
  infraPosts: InfrastructurePost[];
}

export interface HubResponseDto {
  featured: HubFeedItem[];
  feed: HubFeedItem[];
  totalCount: number;
  spotlightData: HubSpotlightData;
}
