import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetTagsQueryDto } from '../dto/get-tags-query.dto';
import { GetTagArticlesQueryDto } from '../dto/get-tag-articles-query.dto';
import { stripMarkdownToPlainText } from '../../common/utils/strip-markdown.util';

interface TagTableConfig {
  table: string;
  type: string;
  categoryDomain: string;
  routePrefix: string;
  titleCol: string;
  descCol: string;
  dateCol: string;
}

export interface TagDirectoryItem {
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
      descCol: 'excerpt',
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
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
    },
    project: {
      table: 'projects',
      type: 'project',
      categoryDomain: 'projects',
      routePrefix: '/projects',
      titleCol: 'title',
      descCol: 'excerpt',
      dateCol: 'publishedAt',
    },
    forum: {
      table: 'forum_topics',
      type: 'forum',
      categoryDomain: 'forum',
      routePrefix: '/forum',
      titleCol: 'title',
      descCol: 'COALESCE(excerpt, content)',
      dateCol: 'createdAt',
    },
  };

  constructor(
    @InjectDataSource('doiceladevConnection')
    private readonly dataSource: DataSource,
  ) {}

  async getAllTags(query: GetTagsQueryDto = {}): Promise<TagDirectoryItem[]> {
    const lang = query.lang || 'es';

    try {
      const configs = Object.values(this.tableConfigs);
      const unionSql = configs
        .map(
          (c) =>
            `SELECT '${c.type}' AS content_type, id FROM ${c.table} WHERE language = ?`,
        )
        .join(' UNION ALL ');
      const params: string[] = configs.map(() => lang);

      const rows: Array<{
        id: number;
        slug: string;
        label: string;
        count: number;
      }> = await this.dataSource.query(
        `SELECT t.id, t.slug, t.label, COUNT(*) AS count
         FROM tags t
         INNER JOIN content_tags ct ON t.id = ct.tag_id
         INNER JOIN (${unionSql}) localized
           ON localized.content_type = ct.content_type
          AND localized.id = ct.content_id
         GROUP BY t.id, t.slug, t.label
         ORDER BY count DESC, t.label ASC`,
        params,
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
        `Error al listar tags: ${error instanceof Error ? error.message : String(error)}`,
      );
      return [];
    }
  }

  async getArticlesByTag(
    tagSlug: string,
    query: GetTagArticlesQueryDto = {},
  ): Promise<TagArticlesResponse> {
    let rawSlug = tagSlug || '';
    try {
      rawSlug = decodeURIComponent(tagSlug);
    } catch {
      // Mantener valor original si el encoding es inválido
    }
    const normalizedSlug = rawSlug.trim().toLowerCase();
    const lang = query.lang || 'es';
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const search = query.search?.trim().toLowerCase() || '';

    let tagLabel = normalizedSlug;
    let allArticles: TagArticleItem[] = [];

    if (normalizedSlug === 'all') {
      const perTableResults = await Promise.all(
        Object.values(this.tableConfigs).map((config) =>
          this.queryTableArticles(config, lang, search),
        ),
      );
      allArticles = perTableResults.flat();
    } else {
      const tagRows: Array<{ id: number; slug: string; label: string }> =
        await this.dataSource.query(
          `SELECT id, slug, label FROM tags WHERE LOWER(slug) = ? LIMIT 1`,
          [normalizedSlug],
        );

      if (!tagRows || tagRows.length === 0) {
        throw new NotFoundException(`Etiqueta "${tagSlug}" no encontrada`);
      }

      const tagRecord = tagRows[0];
      tagLabel = tagRecord.label || tagRecord.slug;

      const contentTagRows: Array<{
        content_type: string;
        content_id: number;
      }> = await this.dataSource.query(
        `SELECT content_type, content_id FROM content_tags WHERE tag_id = ?`,
        [tagRecord.id],
      );

      const idsByType = new Map<string, number[]>();
      for (const item of contentTagRows) {
        const list = idsByType.get(item.content_type) || [];
        list.push(item.content_id);
        idsByType.set(item.content_type, list);
      }

      const perTableResults = await Promise.all(
        Array.from(idsByType.entries()).map(([type, ids]) => {
          const config = this.tableConfigs[type];
          if (!config || ids.length === 0) return Promise.resolve([]);
          return this.queryTableArticles(config, lang, search, ids);
        }),
      );
      allArticles = perTableResults.flat();
    }

    allArticles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const totalCount = allArticles.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedArticles = allArticles.slice(startIndex, startIndex + limit);

    return {
      tag: {
        slug: normalizedSlug,
        label: tagLabel,
        totalCount,
      },
      articles: paginatedArticles,
      page,
      limit,
      totalPages,
    };
  }

  private async queryTableArticles(
    config: TagTableConfig,
    lang: string,
    search: string,
    ids?: number[],
  ): Promise<TagArticleItem[]> {
    const whereClauses: string[] = ['language = ?'];
    const params: Array<string | number> = [lang];

    if (ids && ids.length > 0) {
      const placeholders = ids.map(() => '?').join(',');
      whereClauses.push(`id IN (${placeholders})`);
      params.push(...ids);
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

    return rows.map((row): TagArticleItem => {
      const sub = (row.category || '').trim().toLowerCase();
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
  }
}
