import { Injectable, Logger } from '@nestjs/common';
import { NewsService } from '../news/services/news.service';
import { BlogService } from '../blog/services/blog.service';
import { CybersecurityService } from '../cybersecurity/services/cybersecurity.service';
import { TutorialsService } from '../tutorials/services/tutorials.service';
import { InfrastructureService } from '../infrastructure/services/infrastructure.service';
import { AiService } from '../ai/services/ai.service';
import { ProjectsService } from '../projects/services/projects.service';
import { ForumService } from '../forum/services/forum.service';

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

export interface HubResponseDto {
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

@Injectable()
export class HubService {
  private readonly logger = new Logger(HubService.name);

  constructor(
    private readonly newsService: NewsService,
    private readonly blogService: BlogService,
    private readonly secService: CybersecurityService,
    private readonly tutService: TutorialsService,
    private readonly infraService: InfrastructureService,
    private readonly aiService: AiService,
    private readonly projService: ProjectsService,
    private readonly forumService: ForumService,
  ) {}

  async getHubData(
    lang: string = 'es',
    search?: string,
  ): Promise<HubResponseDto> {
    // Consultas consolidadas resilientes en paralelo en SQLite local (Fault-Tolerant Aggregator)
    const results = await Promise.allSettled([
      this.newsService.findAll(search, undefined, lang),
      this.blogService.findAll(search, undefined, lang),
      this.secService.findAll(undefined, undefined, search, lang),
      this.tutService.findAll(undefined, search, lang),
      this.infraService.findAll(
        undefined,
        undefined,
        undefined,
        search,
        lang,
        'smart',
      ),
      this.aiService.findAll(undefined, search, lang),
      this.projService.findAll(undefined, search, lang),
      this.forumService.findAllTopics(undefined, search, lang),
    ]);

    const extract = <T>(
      result: PromiseSettledResult<T[]>,
      domain: string,
    ): T[] => {
      if (result.status === 'fulfilled') {
        return Array.isArray(result.value) ? result.value : [];
      }
      const errorMessage =
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason);
      this.logger.error(
        `Fallo al obtener datos del submódulo software/${domain}: ${errorMessage}`,
      );
      return [];
    };

    const news = extract(results[0], 'news');
    const posts = extract(results[1], 'blog');
    const secPosts = extract(results[2], 'cybersecurity');
    const tutorials = extract(results[3], 'tutorials');
    const infraPosts = extract(results[4], 'infrastructure');
    const resources = extract(results[5], 'ai');
    const projects = extract(results[6], 'projects');
    const topics = extract(results[7], 'forum');

    // Mapeo normalizado con cálculo de SmartScore
    const newsItems: HubFeedItem[] = news.map((item) => ({
      id: `news-${item.id}`,
      href: `/software/news/${item.slug}`,
      title: item.title,
      category: 'news',
      coverImage: item.coverImage,
      tag: item.tags?.split(',')[0]?.trim() || 'NOTICIAS',
      categoryMeta: 'Noticias, Frontend',
      excerpt: item.excerpt,
      accentHoverColor: 'group-hover:text-cyan-300',
      date: new Date(
        item.publishedAt || item.createdAt || Date.now(),
      ).toISOString(),
      smartScore:
        (item.featured ? 1000 : 0) +
        (item.isBreaking ? 500 : 0) +
        (item.orderPriority || 0) * 20 +
        (item.likes || 0) * 4 +
        (item.views || 0) * 1.5,
    }));

    const blogItems: HubFeedItem[] = posts.map((item) => ({
      id: `blog-${item.id}`,
      href: `/software/blog/${item.slug}`,
      title: item.title,
      category: 'blog',
      coverImage: item.coverImage,
      tag: item.tags?.split(',')[0]?.trim() || 'ARQUITECTURA',
      categoryMeta: 'Arquitectura, Backend',
      excerpt: item.excerpt,
      accentHoverColor: 'group-hover:text-blue-300',
      date: new Date(
        item.publishedAt || item.createdAt || Date.now(),
      ).toISOString(),
      smartScore:
        (item.featured ? 1000 : 0) +
        (item.orderPriority || 0) * 20 +
        (item.likes || 0) * 4 +
        (item.views || 0) * 1.5,
    }));

    const secItems: HubFeedItem[] = secPosts.map((sec) => ({
      id: `sec-${sec.id}`,
      href: `/software/cybersecurity/${sec.slug}`,
      title: sec.title,
      category: 'cybersecurity',
      tag: sec.cveId || 'CVE',
      categoryMeta: `Aviso ${sec.severity} — Ciberseguridad, Linux`,
      excerpt: sec.excerpt,
      accentHoverColor: 'group-hover:text-rose-300',
      date: new Date(
        sec.publishedAt || sec.createdAt || Date.now(),
      ).toISOString(),
      smartScore:
        (sec.featured ? 1000 : 0) +
        (sec.severity === 'CRITICAL'
          ? 300
          : sec.severity === 'HIGH'
            ? 150
            : 50) +
        (sec.orderPriority || 0) * 20 +
        (sec.likes || 0) * 4 +
        (sec.views || 0) * 1.5,
    }));

    const tutItems: HubFeedItem[] = tutorials.map((tut) => ({
      id: `tut-${tut.id}`,
      href: `/software/tutorials/${tut.slug}`,
      title: tut.title,
      category: 'tutorials',
      coverImage: tut.coverImage,
      tag: tut.difficulty?.toUpperCase() || 'GUÍA',
      categoryMeta: 'Tutorial Práctico',
      excerpt: tut.excerpt,
      accentHoverColor: 'group-hover:text-amber-300',
      date: new Date(
        tut.publishedAt || tut.createdAt || Date.now(),
      ).toISOString(),
      smartScore:
        (tut.featured ? 1000 : 0) +
        (tut.orderPriority || 0) * 20 +
        (tut.likes || 0) * 4 +
        (tut.views || 0) * 1.5,
    }));

    const infraItems: HubFeedItem[] = infraPosts.map((inf) => ({
      id: `infra-${inf.id}`,
      href: `/software/infrastructure/${inf.slug}`,
      title: inf.title,
      category: 'infrastructure',
      subCategory: inf.category,
      tag: inf.environment.toUpperCase(),
      categoryMeta: `${inf.category}, ${inf.environment}`,
      excerpt: inf.subtitle || inf.architectureOverview,
      accentHoverColor: 'group-hover:text-emerald-300',
      date: new Date(
        inf.publishedAt || inf.createdAt || Date.now(),
      ).toISOString(),
      smartScore:
        (inf.featured ? 1000 : 0) +
        (inf.orderPriority || 0) * 20 +
        (inf.likes || 0) * 4 +
        (inf.views || 0) * 1.5,
    }));

    const aiItems: HubFeedItem[] = resources.map((res) => ({
      id: `ai-${res.id}`,
      href: `/software/ai/${res.slug}`,
      title: res.name,
      category: 'ai',
      tag: res.type.toUpperCase(),
      categoryMeta: `${res.provider} — ${res.type.toUpperCase()}`,
      excerpt: res.description,
      accentHoverColor: 'group-hover:text-indigo-300',
      date: new Date(
        res.publishedAt || res.createdAt || Date.now(),
      ).toISOString(),
      smartScore:
        (res.featured ? 1000 : 0) +
        (res.orderPriority || 0) * 20 +
        (res.likes || 0) * 4 +
        (res.views || 0) * 1.5,
    }));

    const projItems: HubFeedItem[] = projects.map((proj) => ({
      id: `proj-${proj.id}`,
      href: `/software/projects/${proj.slug}`,
      title: proj.name,
      category: 'projects',
      tag: 'PROYECTO',
      categoryMeta: `${proj.stars || 0} estrellas GitHub`,
      excerpt: proj.description,
      accentHoverColor: 'group-hover:text-blue-300',
      date: new Date(proj.createdAt || Date.now()).toISOString(),
      smartScore: (proj.orderPriority || 0) * 20 + (proj.stars || 0) * 5,
    }));

    const forumItems: HubFeedItem[] = topics.map((top) => ({
      id: `topic-${top.id}`,
      href: `/software/forum/${top.slug}`,
      title: top.title,
      category: 'forum',
      tag: 'DEBATE',
      categoryMeta: `${top.repliesCount || 0} respuestas`,
      excerpt: top.content,
      accentHoverColor: 'group-hover:text-sky-300',
      date: new Date(top.createdAt || Date.now()).toISOString(),
      smartScore: (top.orderPriority || 0) * 20 + (top.repliesCount || 0) * 10,
    }));

    const allItems: HubFeedItem[] = [
      ...newsItems,
      ...blogItems,
      ...secItems,
      ...tutItems,
      ...infraItems,
      ...aiItems,
      ...projItems,
      ...forumItems,
    ];

    // 1. Podio de Destacados: Top 3 global por SmartScore y fecha descendente
    const sortedBySmart = [...allItems].sort(
      (a, b) =>
        b.smartScore - a.smartScore ||
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const featured = sortedBySmart.slice(0, 3);
    const featuredIds = new Set(featured.map((item) => item.id));

    // 2. Feed Cronológico: El resto ordenado estrictamente por fecha descendente
    const feed = allItems
      .filter((item) => !featuredIds.has(item.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      featured,
      feed,
      totalCount: allItems.length,
      spotlightData: {
        news,
        posts,
        topics,
        aiResources: resources,
        secPosts,
        tutorials,
        projects,
        infraPosts,
      },
    };
  }
}
