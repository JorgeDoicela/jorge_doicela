import { SoftwareArticleCategory } from '../../components/ArticleCover';
import { NewsArticle } from '../news/types';
import { BlogPost } from '../blog/types';
import { ForumTopic } from '../forum/types';
import { AiResource } from '../ai/types';
import { SecurityPost } from '../cybersecurity/types';
import { Tutorial } from '../tutorials/types';
import { Project } from '../projects/types';
import { InfrastructurePost } from '../infrastructure/types';

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

