import { Injectable, Logger } from '@nestjs/common';
import { NewsService } from '../../news/services/news.service';
import { BlogService } from '../../blog/services/blog.service';
import { CybersecurityService } from '../../cybersecurity/services/cybersecurity.service';
import { TutorialsService } from '../../tutorials/services/tutorials.service';
import { InfrastructureService } from '../../infrastructure/services/infrastructure.service';
import { AiService } from '../../ai/services/ai.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { ForumService } from '../../forum/services/forum.service';
import {
  PortalFeedItem,
  PortalSpotlightData,
  PortalResponseDto,
} from '../dto/portal-response.dto';

export type { PortalFeedItem, PortalSpotlightData, PortalResponseDto };

function stripMarkdownToPlainText(
  text?: string | null,
  maxLength = 220,
): string {
  if (!text) return '';
  const clean = text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/gi, '')
    .replace(/^>\s*/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
    .replace(/---+/g, ' ')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trimEnd() + '...';
}

@Injectable()
export class PortalService {
  private readonly logger = new Logger(PortalService.name);

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

  async getPortalData(
    lang: string = 'es',
    search?: string,
  ): Promise<PortalResponseDto> {
    // Consultas consolidadas resilientes en paralelo en SQLite local (Fault-Tolerant Aggregator)
    const results = await Promise.allSettled([
      this.newsService.findAll({ search, lang }),
      this.blogService.findAll({ search, lang }),
      this.secService.findAll({ search, lang }),
      this.tutService.findAll({ search, lang }),
      this.infraService.findAll({ search, lang, sortBy: 'smart' }),
      this.aiService.findAll({ search, lang }),
      this.projService.findAll({ search, lang }),
      this.forumService.findAllTopics({ search, lang }),
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
        `Fallo al obtener datos del submódulo doiceladev/${domain}: ${errorMessage}`,
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

    // Devuelve el slug canónico de Nivel 2; la traducción reactiva reside en el frontend (next-intl)
    const formatSub = (cat?: string): string => {
      if (!cat) return '';
      return cat.trim().toLowerCase();
    };

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
    const newsItems: PortalFeedItem[] = news.map((item) => {
      const dateStr = new Date(
        item.publishedAt || item.createdAt || Date.now(),
      ).toISOString();
      const sub = formatSub(item.category);

      return {
        id: `news-${item.id}`,
        href: `/news/${item.slug}`,
        title: item.title,
        category: 'news',
        coverImage: item.coverImage,
        categoryMeta: sub ? `news • ${sub}` : 'news',
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

    const blogItems: PortalFeedItem[] = posts.map((item) => {
      const dateStr = new Date(
        item.publishedAt || item.createdAt || Date.now(),
      ).toISOString();
      const sub = formatSub(item.category);

      return {
        id: `blog-${item.id}`,
        href: `/blog/${item.slug}`,
        title: item.title,
        category: 'blog',
        coverImage: item.coverImage,
        categoryMeta: sub ? `blog • ${sub}` : 'blog',
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

    const secItems: PortalFeedItem[] = secPosts.map((sec) => {
      const dateStr = new Date(
        sec.publishedAt || sec.createdAt || Date.now(),
      ).toISOString();
      const sub = formatSub(sec.category);

      return {
        id: `sec-${sec.id}`,
        href: `/cybersecurity/${sec.slug}`,
        title: sec.title,
        category: 'cybersecurity',
        coverImage: sec.coverImage,
        categoryMeta: sub ? `cybersecurity • ${sub}` : 'cybersecurity',
        excerpt: sec.excerpt,
        accentHoverColor: 'group-hover:text-rose-300',
        date: dateStr,
        smartScore:
          (sec.featured ? 600 : 0) +
          (sec.orderPriority || 0) * 20 +
          (sec.likes || 0) * 4 +
          (sec.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const tutItems: PortalFeedItem[] = tutorials.map((tut) => {
      const dateStr = new Date(
        tut.publishedAt || tut.createdAt || Date.now(),
      ).toISOString();
      const sub = formatSub(tut.category);

      return {
        id: `tut-${tut.id}`,
        href: `/tutorials/${tut.slug}`,
        title: tut.title,
        category: 'tutorials',
        coverImage: tut.coverImage,
        categoryMeta: sub ? `tutorials • ${sub}` : 'tutorials',
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

    const infraItems: PortalFeedItem[] = infraPosts.map((inf) => {
      const dateStr = new Date(
        inf.publishedAt || inf.createdAt || Date.now(),
      ).toISOString();
      const sub = formatSub(inf.category);

      return {
        id: `infra-${inf.id}`,
        href: `/infrastructure/${inf.slug}`,
        title: inf.title,
        category: 'infrastructure',
        coverImage: inf.coverImage,
        categoryMeta: sub ? `infrastructure • ${sub}` : 'infrastructure',
        excerpt: inf.excerpt,
        accentHoverColor: 'group-hover:text-emerald-300',
        date: dateStr,
        smartScore:
          (inf.featured ? 600 : 0) +
          (inf.orderPriority || 0) * 20 +
          (inf.likes || 0) * 4 +
          (inf.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const aiItems: PortalFeedItem[] = resources.map((res) => {
      const dateStr = new Date(
        res.publishedAt || res.createdAt || Date.now(),
      ).toISOString();
      const sub = formatSub(res.category);

      return {
        id: `ai-${res.id}`,
        href: `/ai/${res.slug}`,
        title: res.title,
        category: 'ai',
        coverImage: res.coverImage,
        categoryMeta: sub ? `ai • ${sub}` : 'ai',
        excerpt: res.excerpt,
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

    const projItems: PortalFeedItem[] = projects.map((proj) => {
      const dateStr = new Date(
        proj.publishedAt || proj.createdAt || Date.now(),
      ).toISOString();
      const sub = formatSub(proj.category);

      return {
        id: `proj-${proj.id}`,
        href: `/projects/${proj.slug}`,
        title: proj.title,
        category: 'projects',
        coverImage: proj.coverImage,
        categoryMeta: sub ? `projects • ${sub}` : 'projects',
        excerpt: proj.excerpt,
        accentHoverColor: 'group-hover:text-blue-300',
        date: dateStr,
        smartScore:
          (proj.featured ? 600 : 0) +
          (proj.orderPriority || 0) * 20 +
          (proj.stars || 0) * 5 +
          (proj.likes || 0) * 4 +
          (proj.views || 0) * 1.5 +
          calculateRecencyBoost(dateStr),
      };
    });

    const forumItems: PortalFeedItem[] = topics.map((top) => {
      const dateStr = new Date(top.createdAt || Date.now()).toISOString();
      const sub = formatSub(top.category);

      return {
        id: `topic-${top.id}`,
        href: `/forum/${top.slug}`,
        title: top.title,
        category: 'forum',
        coverImage: top.coverImage,
        categoryMeta: sub ? `forum • ${sub}` : 'forum',
        excerpt: top.excerpt || stripMarkdownToPlainText(top.content, 220),
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

    const allItems: PortalFeedItem[] = [
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

    // Lógica Editorial de Partición y Deduplicación:
    // Las publicaciones promovidas al carrusel destacado no deben duplicarse en el feed cronológico
    // inferior de la misma vista, evitando redundancia visual y maximizando la diversidad del catálogo.
    const isSmallCatalog = allItems.length <= 3;
    const featuredLimit = isSmallCatalog
      ? allItems.length
      : Math.min(5, Math.max(3, allItems.length - 3));

    const featured = sortedBySmart.slice(0, featuredLimit);
    const featuredIds = new Set(featured.map((item) => item.id));

    // 2. Feed Cronológico de Últimas Publicaciones (Deduplicación Estricta):
    // Excluye los ítems presentes en 'featured' para que cada tarjeta en la página sea única.
    const feed = isSmallCatalog
      ? sortedBySmart
      : [...allItems]
          .filter((item) => !featuredIds.has(item.id))
          .sort(
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
