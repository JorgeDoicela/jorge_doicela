import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetCategoriesQueryDto } from '../dto/get-categories-query.dto';
import { GetCategoryArticlesQueryDto } from '../dto/get-category-articles-query.dto';

interface CategoryTableConfig {
  table: string;
  type: string;
  categoryDomain: string;
  routePrefix: string;
  titleCol: string;
  descCol: string;
  dateCol: string;
  featCol: string;
}

export interface CategoryHubItem {
  slug: string;
  label: string;
  count: number;
  modules: string[];
}

export interface CategoryArticleItem {
  id: string;
  href: string;
  title: string;
  category: string;
  categoryMeta: string;
  coverImage?: string;
  excerpt?: string | null;
  date: string;
}

export interface CategoryArticlesResponse {
  category: {
    slug: string;
    label: string;
    totalCount: number;
  };
  articles: CategoryArticleItem[];
  page: number;
  limit: number;
  totalPages: number;
}

const CATEGORY_ALIAS_MAP: Record<string, string> = {
  // CVE
  analisis_de_cve: 'cve_analysis',
  análisis_de_cve: 'cve_analysis',
  cve_analysis: 'cve_analysis',
  cve: 'cve_analysis',
  // Hardening
  guias_de_bastionado: 'hardening_guide',
  guías_de_bastionado: 'hardening_guide',
  hardening_guide: 'hardening_guide',
  // Advisory
  avisos_de_seguridad: 'advisory',
  advisory: 'advisory',
  // Writeup
  writeups_tecnicos: 'writeup',
  writeups_técnicos: 'writeup',
  writeup: 'writeup',
  // Pentest
  pruebas_de_intrusion: 'pentest',
  pruebas_de_intrusión: 'pentest',
  pentest: 'pentest',
  // Servers
  servidores_linux: 'servers',
  servidores_y_linux: 'servers',
  servers: 'servers',
  // CI/CD
  ci_cd_despliegues: 'ci_cd',
  ci_cd: 'ci_cd',
  // Containers
  contenedores_docker: 'containers',
  containers: 'containers',
  // Web
  ecosistema_web: 'web',
  web: 'web',
  // Frameworks
  frameworks_web: 'frameworks',
  frameworks: 'frameworks',
  // AI
  servidores_mcp: 'mcp_server',
  mcp_server: 'mcp_server',
  modelos_llm: 'llm',
  llm: 'llm',
  frameworks_agenticos: 'agent',
  frameworks_agénticos: 'agent',
  agent: 'agent',
  // Development
  backend_apis: 'backend',
  backend: 'backend',
  frontend_ui: 'frontend',
  frontend: 'frontend',
  movil_multiplataforma: 'mobile',
  móvil_multiplataforma: 'mobile',
  mobile: 'mobile',
  arquitectura_de_software: 'architecture',
  architecture: 'architecture',
  codigo_limpio: 'clean_code',
  código_limpio: 'clean_code',
  clean_code: 'clean_code',
  cloud_devops: 'devops',
  devops: 'devops',
  seguridad_bastionado: 'hardening',
  hardening: 'hardening',
};

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  private readonly tableConfigs: CategoryTableConfig[] = [
    {
      table: 'infrastructure_posts',
      type: 'infrastructure',
      categoryDomain: 'infrastructure',
      routePrefix: '/infrastructure',
      titleCol: 'title',
      descCol: "COALESCE(subtitle, architectureOverview, '')",
      dateCol: 'publishedAt',
      featCol: 'featured',
    },
    {
      table: 'security_posts',
      type: 'security',
      categoryDomain: 'cybersecurity',
      routePrefix: '/cybersecurity',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
      featCol: 'featured',
    },
    {
      table: 'tutorials',
      type: 'tutorial',
      categoryDomain: 'tutorials',
      routePrefix: '/tutorials',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
      featCol: 'featured',
    },
    {
      table: 'blog_posts',
      type: 'blog',
      categoryDomain: 'blog',
      routePrefix: '/blog',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
      featCol: 'featured',
    },
    {
      table: 'news_articles',
      type: 'news',
      categoryDomain: 'news',
      routePrefix: '/news',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
      featCol: 'featured',
    },
    {
      table: 'ai_resources',
      type: 'ai',
      categoryDomain: 'ai',
      routePrefix: '/ai',
      titleCol: 'name',
      descCol: 'description',
      dateCol: 'publishedAt',
      featCol: 'featured',
    },
    {
      table: 'projects',
      type: 'project',
      categoryDomain: 'projects',
      routePrefix: '/projects',
      titleCol: 'name',
      descCol: 'description',
      dateCol: 'createdAt',
      featCol: 'featured',
    },
    {
      table: 'forum_topics',
      type: 'forum',
      categoryDomain: 'forum',
      routePrefix: '/forum',
      titleCol: 'title',
      descCol: 'content',
      dateCol: 'createdAt',
      featCol: 'isPinned',
    },
  ];

  constructor(
    @InjectDataSource('doiceladevConnection')
    private readonly dataSource: DataSource,
  ) {}

  async getAllCategories(
    query: GetCategoriesQueryDto,
  ): Promise<CategoryHubItem[]> {
    const lang = query.lang || 'es';
    const isEn = lang === 'en';

    try {
      const categoryMap = new Map<
        string,
        { count: number; modules: Set<string> }
      >();

      for (const config of this.tableConfigs) {
        const rows: Array<{ category: string; cnt: number }> =
          await this.dataSource.query(
            `SELECT category, COUNT(*) as cnt 
           FROM ${config.table} 
           WHERE language = ? AND category IS NOT NULL AND TRIM(category) != ''
           GROUP BY category`,
            [lang],
          );

        for (const row of rows) {
          const rawSlug = String(row.category || '')
            .trim()
            .toLowerCase();
          if (!rawSlug) continue;

          if (!categoryMap.has(rawSlug)) {
            categoryMap.set(rawSlug, { count: 0, modules: new Set<string>() });
          }
          const entry = categoryMap.get(rawSlug)!;
          entry.count += Number(row.cnt) || 0;
          entry.modules.add(config.categoryDomain);
        }
      }

      const results: CategoryHubItem[] = Array.from(categoryMap.entries()).map(
        ([slug, data]) => ({
          slug,
          label: this.formatCategoryLabel(slug, isEn),
          count: data.count,
          modules: Array.from(data.modules),
        }),
      );

      // Ordenar por cantidad de artículos descendente, luego alfabéticamente
      return results.sort(
        (a, b) => b.count - a.count || a.label.localeCompare(b.label),
      );
    } catch (error) {
      this.logger.error(
        `Error al listar categorías: ${error instanceof Error ? error.message : error}`,
      );
      return [];
    }
  }

  async getArticlesByCategory(
    categorySlug: string,
    query: GetCategoryArticlesQueryDto,
  ): Promise<CategoryArticlesResponse> {
    let rawSlug = categorySlug || '';
    try {
      rawSlug = decodeURIComponent(categorySlug);
    } catch {
      // ignore
    }
    const cleanSlug = rawSlug
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_');
    const unaccented = cleanSlug
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const normalizedSlug =
      cleanSlug === 'all'
        ? 'all'
        : CATEGORY_ALIAS_MAP[cleanSlug] ||
          CATEGORY_ALIAS_MAP[unaccented] ||
          cleanSlug;
    const lang = query.lang || 'es';
    const isEn = lang === 'en';
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const search = query.search?.trim().toLowerCase() || '';

    try {
      const allArticles: CategoryArticleItem[] = [];

      for (const config of this.tableConfigs) {
        const whereClauses: string[] = ['language = ?'];
        const params: any[] = [lang];

        if (normalizedSlug !== 'all') {
          whereClauses.push('LOWER(category) = ?');
          params.push(normalizedSlug);
        }

        if (search) {
          whereClauses.push(
            `(LOWER(${config.titleCol}) LIKE ? OR LOWER(${config.descCol}) LIKE ?)`,
          );
          params.push(`%${search}%`, `%${search}%`);
        }

        const rows: Array<{
          id: number;
          slug: string;
          category: string;
          title: string;
          excerpt?: string;
          coverImage?: string;
          createdAt: string;
          publishedAt?: string;
          orderPriority?: number;
        }> = await this.dataSource.query(
          `SELECT id, slug, category, ${config.titleCol} AS title, ${config.descCol} AS excerpt, coverImage, 
                  createdAt, ${config.dateCol} AS publishedAt,
                  orderPriority
           FROM ${config.table}
           WHERE ${whereClauses.join(' AND ')}`,
          params,
        );

        const moduleLabel = this.formatModuleLabel(config.categoryDomain, isEn);

        for (const row of rows) {
          const categoryLabel = this.formatCategoryLabel(
            row.category || normalizedSlug,
            isEn,
          );
          const dateStr = new Date(
            row.publishedAt || row.createdAt || Date.now(),
          ).toISOString();
          allArticles.push({
            id: `${config.type}-${row.id}`,
            href: `${config.routePrefix}/${row.slug}`,
            title: row.title,
            category: config.categoryDomain,
            categoryMeta: `${moduleLabel} • ${categoryLabel}`,
            coverImage: row.coverImage,
            excerpt: row.excerpt || null,
            date: dateStr,
          });
        }
      }

      // Ordenar cronológicamente descendente
      allArticles.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      const totalCount = allArticles.length;
      const totalPages = Math.ceil(totalCount / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedArticles = allArticles.slice(
        startIndex,
        startIndex + limit,
      );

      return {
        category: {
          slug: normalizedSlug,
          label:
            normalizedSlug === 'all'
              ? isEn
                ? 'All Categories'
                : 'Todas las Categorías'
              : this.formatCategoryLabel(normalizedSlug, isEn),
          totalCount,
        },
        articles: paginatedArticles,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener publicaciones de categoría '${categorySlug}': ${error instanceof Error ? error.message : error}`,
      );
      return {
        category: {
          slug: normalizedSlug,
          label:
            normalizedSlug === 'all'
              ? isEn
                ? 'All Categories'
                : 'Todas las Categorías'
              : this.formatCategoryLabel(normalizedSlug, isEn),
          totalCount: 0,
        },
        articles: [],
        page,
        limit,
        totalPages: 0,
      };
    }
  }

  private formatModuleLabel(domain: string, isEn: boolean): string {
    const map: Record<string, { es: string; en: string }> = {
      infrastructure: { es: 'INFRAESTRUCTURA', en: 'INFRASTRUCTURE' },
      cybersecurity: { es: 'CIBERSEGURIDAD', en: 'CYBERSECURITY' },
      tutorials: { es: 'TUTORIALES', en: 'TUTORIALS' },
      blog: { es: 'BLOG', en: 'BLOG' },
      news: { es: 'NOTICIAS', en: 'NEWS' },
      ai: { es: 'IA', en: 'AI' },
      projects: { es: 'PROYECTOS', en: 'PROJECTS' },
      forum: { es: 'FORO', en: 'FORUM' },
    };
    return (isEn ? map[domain]?.en : map[domain]?.es) || domain.toUpperCase();
  }

  private formatCategoryLabel(cat: string, isEn: boolean): string {
    const map: Record<string, { es: string; en: string }> = {
      hardening_guide: { es: 'Guías de Bastionado', en: 'Hardening Guides' },
      advisory: { es: 'Avisos de Seguridad', en: 'Security Advisories' },
      cve_analysis: { es: 'Análisis de CVE', en: 'CVE Analysis' },
      writeup: { es: 'Writeups Técnicos', en: 'Technical Writeups' },
      pentest: { es: 'Pruebas de Intrusión', en: 'Penetration Testing' },
      mcp_server: { es: 'Servidores MCP', en: 'MCP Servers' },
      llm: { es: 'Modelos LLM', en: 'LLM Models' },
      agent: { es: 'Frameworks Agénticos', en: 'Agentic Frameworks' },
      ci_cd: { es: 'CI/CD & Despliegues', en: 'CI/CD & Deployments' },
      servers: { es: 'Servidores & Linux', en: 'Servers & Linux' },
      containers: { es: 'Contenedores & Docker', en: 'Containers & Docker' },
      clean_code: { es: 'Código Limpio', en: 'Clean Code' },
      hardening: { es: 'Seguridad & Bastionado', en: 'Security & Hardening' },
      architecture: {
        es: 'Arquitectura de Software',
        en: 'Software Architecture',
      },
      devops: { es: 'Cloud & DevOps', en: 'Cloud & DevOps' },
      web: { es: 'Ecosistema Web', en: 'Web Ecosystem' },
      backend: { es: 'Backend & APIs', en: 'Backend & APIs' },
      frontend: { es: 'Frontend & UI', en: 'Frontend & UI' },
      mobile: { es: 'Móvil & Multiplataforma', en: 'Mobile & Cross-Platform' },
      frameworks: { es: 'Frameworks & Web', en: 'Frameworks & Web' },
      general: { es: 'Comunidad General', en: 'General Community' },
      tool: { es: 'Herramientas', en: 'Tools' },
    };
    const found = map[cat.toLowerCase()];
    if (found) return isEn ? found.en : found.es;
    return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
