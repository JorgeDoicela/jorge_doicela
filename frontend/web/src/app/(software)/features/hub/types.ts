import { SoftwareArticleCategory } from '../../components/ArticleCover';

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

export interface HubResponseData {
  featured: HubFeedItem[];
  feed: HubFeedItem[];
  totalCount: number;
  spotlightData: {
    news: any[];
    posts: any[];
    topics: any[];
    aiResources: any[];
    secPosts: any[];
    tutorials: any[];
    projects: any[];
    infraPosts: any[];
  };
}
