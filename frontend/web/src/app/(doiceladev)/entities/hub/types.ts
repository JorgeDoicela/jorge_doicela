import type { DoiceladevArticleCategory } from '../../shared/ui/ArticleCover';
import type { NewsArticle } from '../news';
import type { BlogPost } from '../blog';
import type { ForumTopic } from '../forum';
import type { AiResource } from '../ai';
import type { SecurityPost } from '../cybersecurity';
import type { Tutorial } from '../tutorials';
import type { Project } from '../projects';
import type { InfrastructurePost } from '../infrastructure';

export interface HubFeedItem {
  id: string;
  href: string;
  title: string;
  category: DoiceladevArticleCategory;
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

export interface HubResponseData {
  featured: HubFeedItem[];
  feed: HubFeedItem[];
  totalCount: number;
  spotlightData: HubSpotlightData;
}

