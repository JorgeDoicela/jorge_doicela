import { SoftwareArticleCategory } from '../../shared/ui/ArticleCover';
import { NewsArticle } from '../news';
import { BlogPost } from '../blog';
import { ForumTopic } from '../forum';
import { AiResource } from '../ai';
import { SecurityPost } from '../cybersecurity';
import { Tutorial } from '../tutorials';
import { Project } from '../projects';
import { InfrastructurePost } from '../infrastructure';

export interface HubFeedItem {
  id: string;
  href: string;
  title: string;
  category: SoftwareArticleCategory;
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

export interface HubResponseData {
  featured: HubFeedItem[];
  feed: HubFeedItem[];
  totalCount: number;
  spotlightData: HubSpotlightData;
}

