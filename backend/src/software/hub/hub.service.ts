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

    const isEn = lang === 'en';

    // Función pura para calcular el impulso de frescura / recency decay
    const calculateRecencyBoost = (dateStr: string): number => {
      const pubTime = new Date(dateStr).getTime();
      if (isNaN(pubTime)) return 0;
      const daysOld = Math.max(
        0,
        (Date.now() - pubTime) / (1000 * 60 * 60 * 24),
      );
      return Math.max(0, Math.round((60 - daysOld) * 3));
    };

    // Mapeo normalizado con cálculo de SmartScore
    const newsItems: HubFeedItem[] = news.map((item) => {
      const dateStr = new Date(
        item.publishedAt || item.createdAt || Date.now(),
      ).toISOString();
      return {
        id: `news-${item.id}`,
        href: `/news/${item.slug}`,
        title: item.title,
        category: 'news',
        coverImage: item.coverImage,
        tag: item.tags?.split(',')[0]?.trim() || (isEn ? 'NEWS' : 'NOTICIAS'),
        categoryMeta: isEn ? 'News, Frontend' : 'Noticias, Frontend',
        excerpt: item.excerpt,
        accentHoverColor: 'group-hover:text-cyan-300',
        date: dateStr,
        smartScore:
          (item.featured ? 600 : 0) +
          (item.isBreaking ? 400 : 0) +
          (item.orderPriority || 0) * 20 +
          (item.likes || 0) * 4 +
          (item.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const blogItems: HubFeedItem[] = posts.map((item) => {
      const dateStr = new Date(
        item.publishedAt || item.createdAt || Date.now(),
      ).toISOString();
      return {
        id: `blog-${item.id}`,
        href: `/blog/${item.slug}`,
        title: item.title,
        category: 'blog',
        coverImage: item.coverImage,
        tag:
          item.tags?.split(',')[0]?.trim() ||
          (isEn ? 'ARCHITECTURE' : 'ARQUITECTURA'),
        categoryMeta: isEn ? 'Architecture, Backend' : 'Arquitectura, Backend',
        excerpt: item.excerpt,
        accentHoverColor: 'group-hover:text-blue-300',
        date: dateStr,
        smartScore:
          (item.featured ? 600 : 0) +
          (item.orderPriority || 0) * 20 +
          (item.likes || 0) * 4 +
          (item.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const secItems: HubFeedItem[] = secPosts.map((sec) => {
      const dateStr = new Date(
        sec.publishedAt || sec.createdAt || Date.now(),
      ).toISOString();
      return {
        id: `sec-${sec.id}`,
        href: `/cybersecurity/${sec.slug}`,
        title: sec.title,
        category: 'cybersecurity',
        tag: sec.cveId || 'CVE',
        categoryMeta: isEn
          ? `Advisory ${sec.severity} — Cybersecurity, Linux`
          : `Aviso ${sec.severity} — Ciberseguridad, Linux`,
        excerpt: sec.excerpt,
        accentHoverColor: 'group-hover:text-rose-300',
        date: dateStr,
        smartScore:
          (sec.featured ? 600 : 0) +
          (sec.severity === 'CRITICAL'
            ? 350
            : sec.severity === 'HIGH'
              ? 150
              : 50) +
          (sec.orderPriority || 0) * 20 +
          (sec.likes || 0) * 4 +
          (sec.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const tutItems: HubFeedItem[] = tutorials.map((tut) => {
      const dateStr = new Date(
        tut.publishedAt || tut.createdAt || Date.now(),
      ).toISOString();
      return {
        id: `tut-${tut.id}`,
        href: `/tutorials/${tut.slug}`,
        title: tut.title,
        category: 'tutorials',
        coverImage: tut.coverImage,
        tag: tut.difficulty?.toUpperCase() || (isEn ? 'GUIDE' : 'GUÍA'),
        categoryMeta: isEn ? 'Hands-on Tutorial' : 'Tutorial Práctico',
        excerpt: tut.excerpt,
        accentHoverColor: 'group-hover:text-amber-300',
        date: dateStr,
        smartScore:
          (tut.featured ? 600 : 0) +
          (tut.orderPriority || 0) * 20 +
          (tut.likes || 0) * 4 +
          (tut.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const infraItems: HubFeedItem[] = infraPosts.map((inf) => {
      const dateStr = new Date(
        inf.publishedAt || inf.createdAt || Date.now(),
      ).toISOString();
      return {
        id: `infra-${inf.id}`,
        href: `/infrastructure/${inf.slug}`,
        title: inf.title,
        category: 'infrastructure',
        subCategory: inf.category,
        tag: inf.environment.toUpperCase(),
        categoryMeta: `${inf.category}, ${inf.environment}`,
        excerpt: inf.subtitle || inf.architectureOverview,
        accentHoverColor: 'group-hover:text-emerald-300',
        date: dateStr,
        smartScore:
          (inf.orderPriority || 0) * 20 +
          (inf.likes || 0) * 4 +
          (inf.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const aiItems: HubFeedItem[] = resources.map((res) => {
      const dateStr = new Date(
        res.publishedAt || res.createdAt || Date.now(),
      ).toISOString();
      return {
        id: `ai-${res.id}`,
        href: `/ai/${res.slug}`,
        title: res.name,
        category: 'ai',
        tag: res.type.toUpperCase(),
        categoryMeta: `${res.provider} — ${res.type.toUpperCase()}`,
        excerpt: res.description,
        accentHoverColor: 'group-hover:text-indigo-300',
        date: dateStr,
        smartScore:
          (res.featured ? 600 : 0) +
          (res.orderPriority || 0) * 20 +
          (res.likes || 0) * 4 +
          (res.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const projItems: HubFeedItem[] = projects.map((proj) => {
      const dateStr = new Date(proj.createdAt || Date.now()).toISOString();
      return {
        id: `proj-${proj.id}`,
        href: `/projects/${proj.slug}`,
        title: proj.name,
        category: 'projects',
        tag: isEn ? 'PROJECT' : 'PROYECTO',
        categoryMeta: isEn
          ? `${proj.stars || 0} GitHub stars`
          : `${proj.stars || 0} estrellas GitHub`,
        excerpt: proj.description,
        accentHoverColor: 'group-hover:text-blue-300',
        date: dateStr,
        smartScore:
          (proj.featured ? 600 : 0) +
          (proj.orderPriority || 0) * 20 +
          (proj.stars || 0) * 5 +
          (proj.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const forumItems: HubFeedItem[] = topics.map((top) => {
      const dateStr = new Date(top.createdAt || Date.now()).toISOString();
      return {
        id: `topic-${top.id}`,
        href: `/forum/${top.slug}`,
        title: top.title,
        category: 'forum',
        tag: isEn ? 'DISCUSSION' : 'DEBATE',
        categoryMeta: isEn
          ? `${top.repliesCount || 0} replies`
          : `${top.repliesCount || 0} respuestas`,
        excerpt: top.content,
        accentHoverColor: 'group-hover:text-sky-300',
        date: dateStr,
        smartScore:
          (top.isPinned ? 300 : 0) +
          (top.isSolved ? 100 : 0) +
          (top.orderPriority || 0) * 20 +
          (top.repliesCount || 0) * 8 +
          (top.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

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

    // 1. Carrusel de Destacadas Inteligentes: Top publicaciones con mayor SmartScore
    const sortedBySmart = [...allItems].sort(
      (a, b) =>
        b.smartScore - a.smartScore ||
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const featured = sortedBySmart.slice(0, 8);

    // 2. Feed Cronológico Unificado: El catálogo completo ordenado por fecha descendente
    const feed = [...allItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

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
