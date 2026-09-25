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
  HubFeedItem,
  HubSpotlightData,
  HubResponseDto,
} from '../dto/hub-response.dto';

export type { HubFeedItem, HubSpotlightData, HubResponseDto };

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

    // Función pura para normalizar subcategorías sin dejar slugs técnicos con guiones bajos
    const formatSub = (cat?: string): string => {
      if (!cat) return '';
      const map: Record<string, { es: string; en: string }> = {
        hardening_guide: { es: 'GUÍAS DE BASTIONADO', en: 'HARDENING GUIDES' },
        advisory: { es: 'AVISOS DE SEGURIDAD', en: 'SECURITY ADVISORIES' },
        cve_analysis: { es: 'ANÁLISIS CVE', en: 'CVE ANALYSIS' },
        writeup: { es: 'WRITEUPS TÉCNICOS', en: 'TECHNICAL WRITEUPS' },
        pentest: { es: 'PENTESTING', en: 'PENTESTING' },
        mcp_server: { es: 'SERVIDORES MCP', en: 'MCP SERVERS' },
        llm: { es: 'MODELOS LLM', en: 'LLM MODELS' },
        agent: { es: 'FRAMEWORKS AGÉNTICOS', en: 'AGENTIC FRAMEWORKS' },
        ci_cd: { es: 'CI/CD & DESPLIEGUES', en: 'CI/CD & DEPLOYMENTS' },
        bare_metal: { es: 'BARE METAL', en: 'BARE METAL' },
        servers: { es: 'SERVIDORES & LINUX', en: 'SERVERS & LINUX' },
        containers: { es: 'CONTENEDORES', en: 'CONTAINERS' },
        clean_code: { es: 'CÓDIGO LIMPIO', en: 'CLEAN CODE' },
      };
      const found = map[cat.toLowerCase()];
      if (found) return isEn ? found.en : found.es;
      return cat.replace(/_/g, ' ').toUpperCase();
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
    const newsItems: HubFeedItem[] = news.map((item) => {
      const dateStr = new Date(
        item.publishedAt || item.createdAt || Date.now(),
      ).toISOString();
      const module = isEn ? 'NEWS' : 'NOTICIAS';
      const sub = formatSub(item.category);

      return {
        id: `news-${item.id}`,
        href: `/news/${item.slug}`,
        title: item.title,
        category: 'news',
        coverImage: item.coverImage,
        tag: item.isBreaking ? (isEn ? 'BREAKING' : 'URGENTE') : sub || module,
        categoryMeta: sub ? `${module} • ${sub}` : module,
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
      const module = isEn ? 'BLOG' : 'BLOG';
      const sub = formatSub(item.category);

      return {
        id: `blog-${item.id}`,
        href: `/blog/${item.slug}`,
        title: item.title,
        category: 'blog',
        coverImage: item.coverImage,
        tag: sub || module,
        categoryMeta: sub ? `${module} • ${sub}` : module,
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
      const module = isEn ? 'SECURITY' : 'SEGURIDAD';
      const sub = formatSub(sec.category);
      const sevMap: Record<string, string> = {
        CRITICAL: isEn ? 'CRITICAL' : 'CRÍTICO',
        HIGH: isEn ? 'HIGH' : 'ALTO',
        MEDIUM: isEn ? 'MEDIUM' : 'MEDIO',
        LOW: isEn ? 'LOW' : 'BAJO',
      };
      const sev = sec.severity
        ? sevMap[sec.severity.toUpperCase()] || sec.severity
        : '';

      return {
        id: `sec-${sec.id}`,
        href: `/cybersecurity/${sec.slug}`,
        title: sec.title,
        category: 'cybersecurity',
        coverImage: sec.coverImage,
        tag: sec.cveId || sev,
        categoryMeta: sub ? `${module} • ${sub}` : module,
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
      const module = isEn ? 'TUTORIALS' : 'TUTORIALES';
      const sub = formatSub(tut.category);
      const diffMap: Record<string, string> = {
        beginner: isEn ? 'BEGINNER' : 'PRINCIPIANTE',
        intermediate: isEn ? 'INTERMEDIATE' : 'INTERMEDIO',
        advanced: isEn ? 'ADVANCED' : 'AVANZADO',
      };
      const diff = tut.difficulty
        ? diffMap[tut.difficulty.toLowerCase()] || tut.difficulty.toUpperCase()
        : '';

      return {
        id: `tut-${tut.id}`,
        href: `/tutorials/${tut.slug}`,
        title: tut.title,
        category: 'tutorials',
        coverImage: tut.coverImage,
        tag: diff,
        categoryMeta: sub ? `${module} • ${sub}` : module,
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
      const module = isEn ? 'INFRASTRUCTURE' : 'INFRAESTRUCTURA';
      const sub = formatSub(inf.category);
      const envMap: Record<string, string> = {
        production: isEn ? 'PRODUCTION' : 'PRODUCCIÓN',
        staging: isEn ? 'STAGING' : 'STAGING',
        homelab: isEn ? 'HOMELAB' : 'HOMELAB',
        bare_metal: isEn ? 'BARE METAL' : 'BARE METAL',
      };
      const env = inf.environment
        ? envMap[inf.environment.toLowerCase()] ||
          inf.environment.replace(/_/g, ' ').toUpperCase()
        : '';

      return {
        id: `infra-${inf.id}`,
        href: `/infrastructure/${inf.slug}`,
        title: inf.title,
        category: 'infrastructure',
        coverImage: inf.coverImage,
        tag: env,
        categoryMeta: sub ? `${module} • ${sub}` : module,
        excerpt: inf.subtitle || inf.architectureOverview,
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

    const aiItems: HubFeedItem[] = resources.map((res) => {
      const dateStr = new Date(
        res.publishedAt || res.createdAt || Date.now(),
      ).toISOString();
      const module = isEn ? 'AI' : 'IA';
      const sub = formatSub(res.category);

      return {
        id: `ai-${res.id}`,
        href: `/ai/${res.slug}`,
        title: res.name,
        category: 'ai',
        coverImage: res.coverImage,
        tag: res.license?.toUpperCase() || '',
        categoryMeta: sub ? `${module} • ${sub}` : module,
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
      const module = isEn ? 'PROJECTS' : 'PROYECTOS';
      const sub = formatSub(proj.category);
      const statusMap: Record<string, string> = {
        active: isEn ? 'IN PRODUCTION' : 'EN PRODUCCIÓN',
        wip: isEn ? 'IN DEVELOPMENT' : 'EN DESARROLLO',
        archived: isEn ? 'ARCHIVED' : 'ARCHIVADO',
      };
      const stat = proj.status
        ? statusMap[proj.status.toLowerCase()] || proj.status.toUpperCase()
        : '';

      return {
        id: `proj-${proj.id}`,
        href: `/projects/${proj.slug}`,
        title: proj.name,
        category: 'projects',
        coverImage: proj.coverImage,
        tag: stat,
        categoryMeta: sub ? `${module} • ${sub}` : module,
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
      const module = isEn ? 'FORUM' : 'FORO';
      const sub = formatSub(top.category);

      return {
        id: `topic-${top.id}`,
        href: `/forum/${top.slug}`,
        title: top.title,
        category: 'forum',
        coverImage: top.coverImage,
        tag: isEn ? 'DISCUSSION' : 'DEBATE',
        categoryMeta: sub ? `${module} • ${sub}` : module,
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
