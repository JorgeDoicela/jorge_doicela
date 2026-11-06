import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetTagArticlesQueryDto } from '../dto/get-tag-articles-query.dto';

interface TagTableConfig {
  table: string;
  type: string;
  categoryDomain: string;
  routePrefix: string;
  titleCol: string;
  descCol: string;
  dateCol: string;
}

export interface TagHubItem {
  id: number;
  slug: string;
  label: string;
  count: number;
}

export interface TagArticleItem {
  id: string;
  href: string;
  title: string;
  category: string;
  categoryMeta: string;
  coverImage?: string;
  excerpt?: string | null;
  date: string;
}

export interface TagArticlesResponse {
  tag: {
    slug: string;
    label: string;
    totalCount: number;
  };
  articles: TagArticleItem[];
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  private readonly tableConfigs: Record<string, TagTableConfig> = {
    infrastructure: {
      table: 'infrastructure_posts',
      type: 'infrastructure',
      categoryDomain: 'infrastructure',
      routePrefix: '/infrastructure',
      titleCol: 'title',
      descCol: "COALESCE(subtitle, architectureOverview, '')",
      dateCol: 'publishedAt',
    },
    security: {
      table: 'security_posts',
      type: 'security',
      categoryDomain: 'cybersecurity',
      routePrefix: '/cybersecurity',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
    },
    tutorial: {
      table: 'tutorials',
      type: 'tutorial',
      categoryDomain: 'tutorials',
      routePrefix: '/tutorials',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
    },
    blog: {
      table: 'blog_posts',
      type: 'blog',
      categoryDomain: 'blog',
      routePrefix: '/blog',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
    },
    news: {
      table: 'news_articles',
      type: 'news',
      categoryDomain: 'news',
      routePrefix: '/news',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
    },
    ai: {
      table: 'ai_resources',
      type: 'ai',
      categoryDomain: 'ai',
      routePrefix: '/ai',
      titleCol: 'name',
      descCol: 'description',
      dateCol: 'publishedAt',
    },
    project: {
      table: 'projects',
      type: 'project',
      categoryDomain: 'projects',
      routePrefix: '/projects',
      titleCol: 'name',
      descCol: 'description',
      dateCol: 'createdAt',
    },
    forum: {
      table: 'forum_topics',
      type: 'forum',
      categoryDomain: 'forum',
      routePrefix: '/forum',
      titleCol: 'title',
      descCol: 'content',
      dateCol: 'createdAt',
    },
  };

  constructor(
    @InjectDataSource('doiceladevConnection')
    private readonly dataSource: DataSource,
  ) {}

  async getAllTags(): Promise<TagHubItem[]> {
    try {
      const rows: Array<{
        id: number;
        slug: string;
        label: string;
        count: number;
      }> = await this.dataSource.query(
        `SELECT t.id, t.slug, t.label, COUNT(ct.content_id) as count
         FROM tags t
         LEFT JOIN content_tags ct ON t.id = ct.tag_id
         GROUP BY t.id, t.slug, t.label
         ORDER BY count DESC, t.label ASC`,
      );

      return rows.map((r) => ({
        id: Number(r.id),
        slug: String(r.slug || '')
          .trim()
          .toLowerCase(),
        label: String(r.label || '').trim(),
        count: Number(r.count) || 0,
      }));
    } catch (error) {
      this.logger.error(
        `Error al listar tags: ${error instanceof Error ? error.message : error}`,
      );
      return [];
    }
  }

  async getArticlesByTag(
    tagSlug: string,
    query: GetTagArticlesQueryDto,
  ): Promise<TagArticlesResponse> {
    const normalizedSlug = tagSlug.trim().toLowerCase();
    const lang = query.lang || 'es';
    const isEn = lang === 'en';
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const search = query.search?.trim().toLowerCase() || '';

    try {
      const allArticles: TagArticleItem[] = [];

      if (normalizedSlug === 'all') {
        for (const config of Object.values(this.tableConfigs)) {
          const whereClauses: string[] = ['language = ?'];
          const params: any[] = [lang];

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

          const moduleLabel = this.formatModuleLabel(
            config.categoryDomain,
            isEn,
          );

          for (const row of rows) {
            const categoryLabel = this.formatCategoryLabel(row.category, isEn);
            const dateStr = new Date(
              row.publishedAt || row.createdAt || Date.now(),
            ).toISOString();

            allArticles.push({
              id: `${config.type}-${row.id}`,
              href: `${config.routePrefix}/${row.slug}`,
              title: row.title,
              category: config.categoryDomain,
              categoryMeta: categoryLabel
                ? `${moduleLabel} • ${categoryLabel}`
                : moduleLabel,
              coverImage: row.coverImage,
              excerpt: row.excerpt || null,
              date: dateStr,
            });
          }
        }
      } else {
        // 1. Obtener tag
        const tagRows: Array<{ id: number; slug: string; label: string }> =
          await this.dataSource.query(
            `SELECT id, slug, label FROM tags WHERE LOWER(slug) = ? LIMIT 1`,
            [normalizedSlug],
          );

        if (!tagRows || tagRows.length === 0) {
          return {
            tag: { slug: normalizedSlug, label: normalizedSlug, totalCount: 0 },
            articles: [],
            page,
            limit,
            totalPages: 0,
          };
        }

        const tagRecord = tagRows[0];

        // 2. Obtener vinculaciones en content_tags
        const contentTagRows: Array<{
          content_type: string;
          content_id: number;
        }> = await this.dataSource.query(
          `SELECT content_type, content_id FROM content_tags WHERE tag_id = ?`,
          [tagRecord.id],
        );

        if (!contentTagRows || contentTagRows.length === 0) {
          return {
            tag: {
              slug: tagRecord.slug,
              label: tagRecord.label,
              totalCount: 0,
            },
            articles: [],
            page,
            limit,
            totalPages: 0,
          };
        }

        // Agrupar IDs por tipo de contenido
        const idsByType = new Map<string, number[]>();
        for (const item of contentTagRows) {
          if (!idsByType.has(item.content_type)) {
            idsByType.set(item.content_type, []);
          }
          idsByType.get(item.content_type)!.push(item.content_id);
        }

        for (const [type, ids] of idsByType.entries()) {
          const config = this.tableConfigs[type];
          if (!config || ids.length === 0) continue;

          const placeholders = ids.map(() => '?').join(',');
          const whereClauses: string[] = [
            `language = ?`,
            `id IN (${placeholders})`,
          ];
          const params: any[] = [lang, ...ids];

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

          const moduleLabel = this.formatModuleLabel(
            config.categoryDomain,
            isEn,
          );

          for (const row of rows) {
            const categoryLabel = this.formatCategoryLabel(row.category, isEn);
            const dateStr = new Date(
              row.publishedAt || row.createdAt || Date.now(),
            ).toISOString();

            allArticles.push({
              id: `${config.type}-${row.id}`,
              href: `${config.routePrefix}/${row.slug}`,
              title: row.title,
              category: config.categoryDomain,
              categoryMeta: categoryLabel
                ? `${moduleLabel} • ${categoryLabel}`
                : moduleLabel,
              coverImage: row.coverImage,
              excerpt: row.excerpt || null,
              date: dateStr,
            });
          }
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
        tag: {
          slug: normalizedSlug,
          label:
            normalizedSlug === 'all'
              ? isEn
                ? 'All Tags'
                : 'Todas las Etiquetas'
              : normalizedSlug,
          totalCount,
        },
        articles: paginatedArticles,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener artículos por tag '${tagSlug}': ${error instanceof Error ? error.message : error}`,
      );
      return {
        tag: {
          slug: normalizedSlug,
          label:
            normalizedSlug === 'all'
              ? isEn
                ? 'All Tags'
                : 'Todas las Etiquetas'
              : normalizedSlug,
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
    if (!cat) return '';
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
