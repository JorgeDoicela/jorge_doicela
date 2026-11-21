import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetCategoriesQueryDto } from '../dto/get-categories-query.dto';
import { GetCategoryArticlesQueryDto } from '../dto/get-category-articles-query.dto';
import { stripMarkdownToPlainText } from '../../common/utils/strip-markdown.util';

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

export interface CategoryDirectoryItem {
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
  analisis_de_cve: 'cve_analysis',
  análisis_de_cve: 'cve_analysis',
  cve_analysis: 'cve_analysis',
  cve: 'cve_analysis',
  guias_de_bastionado: 'hardening_guide',
  guías_de_bastionado: 'hardening_guide',
  hardening_guide: 'hardening_guide',
  avisos_de_seguridad: 'advisory',
  advisory: 'advisory',
  writeups_tecnicos: 'writeup',
  writeups_técnicos: 'writeup',
  writeup: 'writeup',
  pruebas_de_intrusion: 'pentest',
  pruebas_de_intrusión: 'pentest',
  pentest: 'pentest',
  servidores_linux: 'servers',
  servidores_y_linux: 'servers',
  servers: 'servers',
  ci_cd_despliegues: 'ci_cd',
  ci_cd: 'ci_cd',
  contenedores_docker: 'containers',
  containers: 'containers',
  ecosistema_web: 'web',
  web: 'web',
  frameworks_web: 'frameworks',
  frameworks: 'frameworks',
  servidores_mcp: 'mcp_server',
  mcp_server: 'mcp_server',
  modelos_llm: 'llm',
  llm: 'llm',
  frameworks_agenticos: 'agent',
  frameworks_agénticos: 'agent',
  agent: 'agent',
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
  ciberseguridad: 'security',
  seguridad: 'security',
  security: 'security',
  cybersecurity: 'security',
  lecciones_aprendidas: 'lessons',
  lessons: 'lessons',
  errores_postmortems: 'postmortems',
  postmortems: 'postmortems',
  ensayos_opinion: 'opinion',
  opinion: 'opinion',
  carrera_tecnica: 'career',
  career: 'career',
  bitacora_de_ingenieria: 'journal',
  journal: 'journal',
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
      descCol: 'excerpt',
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
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
      featCol: 'featured',
    },
    {
      table: 'projects',
      type: 'project',
      categoryDomain: 'projects',
      routePrefix: '/projects',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
      featCol: 'featured',
    },
    {
      table: 'forum_topics',
      type: 'forum',
      categoryDomain: 'forum',
      routePrefix: '/forum',
      titleCol: 'title',
      descCol: 'COALESCE(excerpt, content)',
      dateCol: 'createdAt',
      featCol: 'isPinned',
    },
  ];

  constructor(
    @InjectDataSource('doiceladevConnection')
    private readonly dataSource: DataSource,
  ) {}

  async getAllCategories(
    query: GetCategoriesQueryDto = {},
  ): Promise<CategoryDirectoryItem[]> {
    const lang = query.lang || 'es';

    try {
      const perTableRows = await Promise.all(
        this.tableConfigs.map(async (config) => {
          const rows: Array<{ category: string; cnt: number }> =
            await this.dataSource.query(
              `SELECT category, COUNT(*) as cnt
               FROM ${config.table}
               WHERE language = ? AND category IS NOT NULL AND TRIM(category) != ''
               GROUP BY category`,
              [lang],
            );
          return { domain: config.categoryDomain, rows };
        }),
      );

      const categoryMap = new Map<
        string,
        { count: number; modules: Set<string> }
      >();

      for (const { domain, rows } of perTableRows) {
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
          entry.modules.add(domain);
        }
      }

      const results: CategoryDirectoryItem[] = Array.from(
        categoryMap.entries(),
      ).map(([slug, data]) => ({
        slug,
        label: slug,
        count: data.count,
        modules: Array.from(data.modules),
      }));

      return results.sort(
        (a, b) => b.count - a.count || a.slug.localeCompare(b.slug),
      );
    } catch (error) {
      this.logger.error(
        `Error al listar categorías: ${error instanceof Error ? error.message : String(error)}`,
      );
      return [];
    }
  }

  async getArticlesByCategory(
    categorySlug: string,
    query: GetCategoryArticlesQueryDto = {},
  ): Promise<CategoryArticlesResponse> {
    let rawSlug = categorySlug || '';
    try {
      rawSlug = decodeURIComponent(categorySlug);
    } catch {
      // Mantener valor original si el encoding es inválido
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
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const search = query.search?.trim().toLowerCase() || '';

    const perTableResults = await Promise.all(
      this.tableConfigs.map(async (config) => {
        const whereClauses: string[] = ['language = ?'];
        const params: Array<string | number> = [lang];

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
        }> = await this.dataSource.query(
          `SELECT id, slug, category, ${config.titleCol} AS title, ${config.descCol} AS excerpt, coverImage,
                  createdAt, ${config.dateCol} AS publishedAt
           FROM ${config.table}
           WHERE ${whereClauses.join(' AND ')}`,
          params,
        );

        return rows.map((row): CategoryArticleItem => {
          const sub = (row.category || normalizedSlug || '')
            .trim()
            .toLowerCase();
          const dateStr = new Date(
            row.publishedAt || row.createdAt || Date.now(),
          ).toISOString();
          const excerpt =
            config.type === 'forum'
              ? stripMarkdownToPlainText(row.excerpt, 220) || null
              : row.excerpt || null;

          return {
            id: `${config.type}-${row.id}`,
            href: `${config.routePrefix}/${row.slug}`,
            title: row.title,
            category: config.categoryDomain,
            categoryMeta: sub
              ? `${config.categoryDomain} • ${sub}`
              : config.categoryDomain,
            coverImage: row.coverImage,
            excerpt,
            date: dateStr,
          };
        });
      }),
    );

    const allArticles = perTableResults
      .flat()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (normalizedSlug !== 'all' && !search && allArticles.length === 0) {
      throw new NotFoundException(`Categoría "${categorySlug}" no encontrada`);
    }

    const totalCount = allArticles.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedArticles = allArticles.slice(startIndex, startIndex + limit);

    return {
      category: {
        slug: normalizedSlug,
        label: normalizedSlug,
        totalCount,
      },
      articles: paginatedArticles,
      page,
      limit,
      totalPages,
    };
  }
}
