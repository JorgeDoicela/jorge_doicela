import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetRecommendationsQueryDto } from '../dto/get-recommendations-query.dto';
import { RecommendationCardDto } from '../dto/recommendation-card.dto';

interface ContentTableConfig {
  table: string;
  type: string;
  categoryDomain: string;
  routePrefix: string;
  titleCol: string;
  featCol: string;
  tagCol?: string;
}

interface ContentRow {
  id: number;
  slug: string;
  category?: string;
  title: string;
  coverImage?: string;
  featured: number | boolean;
  orderPriority?: number;
  views?: number;
  metaTag?: string | number | null;
}

interface TagRow {
  tag_id: number;
}

interface SourceRow {
  id: number;
  category?: string;
}

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  private readonly tableConfigs: ContentTableConfig[] = [
    {
      table: 'infrastructure_posts',
      type: 'infrastructure',
      categoryDomain: 'infrastructure',
      routePrefix: '/infrastructure',
      titleCol: 'title',
      featCol: 'featured',
      tagCol: 'environment',
    },
    {
      table: 'security_posts',
      type: 'security',
      categoryDomain: 'cybersecurity',
      routePrefix: '/cybersecurity',
      titleCol: 'title',
      featCol: 'featured',
      tagCol: 'severity',
    },
    {
      table: 'tutorials',
      type: 'tutorial',
      categoryDomain: 'tutorials',
      routePrefix: '/tutorials',
      titleCol: 'title',
      featCol: 'featured',
      tagCol: 'difficulty',
    },
    {
      table: 'blog_posts',
      type: 'blog',
      categoryDomain: 'blog',
      routePrefix: '/blog',
      titleCol: 'title',
      featCol: 'featured',
      tagCol: 'category',
    },
    {
      table: 'news_articles',
      type: 'news',
      categoryDomain: 'news',
      routePrefix: '/news',
      titleCol: 'title',
      featCol: 'featured',
      tagCol: 'isBreaking',
    },
    {
      table: 'ai_resources',
      type: 'ai',
      categoryDomain: 'ai',
      routePrefix: '/ai',
      titleCol: 'name',
      featCol: 'featured',
      tagCol: 'license',
    },
    {
      table: 'projects',
      type: 'project',
      categoryDomain: 'projects',
      routePrefix: '/projects',
      titleCol: 'name',
      featCol: 'featured',
      tagCol: 'status',
    },
    {
      table: 'forum_topics',
      type: 'forum',
      categoryDomain: 'forum',
      routePrefix: '/forum',
      titleCol: 'title',
      featCol: 'isPinned',
      tagCol: 'category',
    },
  ];

  constructor(
    @InjectDataSource('doiceladevConnection')
    private readonly dataSource: DataSource,
  ) {}

  async getRecommendations(
    query: GetRecommendationsQueryDto,
  ): Promise<RecommendationCardDto[]> {
    const { slug, lang = 'es', limit = 3, exclude } = query;
    const isEn = lang === 'en';

    // Lista normalizada de slugs a excluir (artículo actual + historial de lectura del usuario)
    const excludedSlugs = new Set<string>();
    if (slug) excludedSlugs.add(slug.trim().toLowerCase());
    if (exclude) {
      exclude
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .forEach((s) => excludedSlugs.add(s));
    }

    try {
      // 1. Identificar el artículo fuente y sus tags en la base de datos
      const source = await this.findSourceArticle(slug, lang);

      // Extraer tags del artículo fuente
      let sourceTagIds: number[] = [];
      let sourceCategory = '';
      let sourceType = '';
      let sourceId = 0;

      if (source) {
        sourceCategory = source.category || '';
        sourceType = source.type;
        sourceId = source.id;

        const tagRows: TagRow[] = await this.dataSource.query<TagRow[]>(
          `SELECT tag_id FROM content_tags WHERE content_type = ? AND content_id = ?`,
          [sourceType, sourceId],
        );
        sourceTagIds = tagRows.map((r: TagRow) => r.tag_id);
      }

      // 2. Matriz de afinidad de dominios para complementar el score
      const domainAffinity: Record<string, string[]> = {
        infrastructure: [
          'infrastructure',
          'cybersecurity',
          'tutorials',
          'projects',
          'blog',
          'forum',
        ],
        cybersecurity: [
          'cybersecurity',
          'infrastructure',
          'tutorials',
          'news',
          'blog',
        ],
        tutorials: [
          'tutorials',
          'infrastructure',
          'cybersecurity',
          'projects',
          'blog',
        ],
        blog: ['blog', 'projects', 'infrastructure', 'ai', 'tutorials'],
        ai: ['ai', 'blog', 'projects', 'news', 'tutorials'],
        news: ['news', 'cybersecurity', 'ai', 'infrastructure', 'blog'],
        projects: [
          'projects',
          'infrastructure',
          'tutorials',
          'blog',
          'cybersecurity',
        ],
        forum: [
          'forum',
          'tutorials',
          'infrastructure',
          'cybersecurity',
          'blog',
        ],
      };

      const preferredDomains =
        domainAffinity[source?.categoryDomain || 'infrastructure'] || [];

      // 3. Recopilar y evaluar candidatos en todos los 8 módulos
      const candidates: Array<{
        card: RecommendationCardDto;
        score: number;
        isExcluded: boolean;
      }> = [];

      for (const config of this.tableConfigs) {
        const rows: ContentRow[] = await this.dataSource.query<ContentRow[]>(
          `SELECT id, slug, category, ${config.titleCol} AS title, coverImage, ${config.featCol} AS featured, 
                  orderPriority, views, ${config.tagCol ? config.tagCol + ' AS metaTag' : "'' AS metaTag"}
           FROM ${config.table} 
           WHERE language = ?`,
          [lang],
        );

        for (const row of rows) {
          const rowSlug = String(row.slug || '')
            .trim()
            .toLowerCase();
          if (rowSlug === slug.trim().toLowerCase()) continue;

          // Obtener tags del candidato
          const candTagRows: TagRow[] = await this.dataSource.query<TagRow[]>(
            `SELECT tag_id FROM content_tags WHERE content_type = ? AND content_id = ?`,
            [config.type, row.id],
          );
          const candTagIds: number[] = candTagRows.map((r: TagRow) => r.tag_id);

          // Similitud de Jaccard
          let jaccard = 0;
          if (sourceTagIds.length > 0 && candTagIds.length > 0) {
            const shared = sourceTagIds.filter((t) =>
              candTagIds.includes(t),
            ).length;
            const union = new Set([...sourceTagIds, ...candTagIds]).size;
            jaccard = union > 0 ? shared / union : 0;
          }

          // Afinidad de dominio / categoría
          let domainScore = 0;
          if (sourceCategory && row.category === sourceCategory) {
            domainScore += 0.3;
          }
          const domainIdx = preferredDomains.indexOf(config.categoryDomain);
          if (domainIdx !== -1) {
            domainScore +=
              (preferredDomains.length - domainIdx) /
              (preferredDomains.length * 3);
          }

          // SmartScore normalizado como factor de desempate de calidad
          const isFeatured = Boolean(row.featured);
          const rawSmart =
            (isFeatured ? 600 : 0) +
            (Number(row.orderPriority) || 0) * 20 +
            (Number(row.views) || 0) * 1.5;
          const normalizedSmart = Math.min(0.2, rawSmart / 5000);

          // Puntuación combinada ponderada
          const totalScore =
            jaccard * 0.55 + domainScore * 0.3 + normalizedSmart * 0.15;

          const isExcluded = excludedSlugs.has(rowSlug);

          // Formateo de etiquetas y metadatos
          const moduleLabel = this.formatModuleLabel(
            config.categoryDomain,
            isEn,
          );
          const subLabel = this.formatSubcategory(row.category, isEn);
          const badgeTag = this.formatBadgeTag(row.metaTag, config.type, isEn);

          candidates.push({
            card: {
              id: `${config.type}-${row.id}`,
              href: `${config.routePrefix}/${row.slug}`,
              title: row.title,
              category: config.categoryDomain,
              categoryMeta: subLabel
                ? `${moduleLabel} • ${subLabel}`
                : moduleLabel,
              coverImage: row.coverImage,
              tag: badgeTag,
              score: Math.round(totalScore * 100) / 100,
            },
            score: totalScore,
            isExcluded,
          });
        }
      }

      // 4. Estrategia de Selección Antifatiga:
      // Priorizar candidatos NO leídos. Si no alcanzan para completar el 'limit',
      // incorporar candidatos leídos con penalización de ranking.
      const unreadCandidates = candidates
        .filter((c) => !c.isExcluded)
        .sort((a, b) => b.score - a.score);

      if (unreadCandidates.length >= limit) {
        return unreadCandidates.slice(0, limit).map((c) => c.card);
      }

      // Si no hay suficientes no leídos, rellenar con leídos de mayor score
      const readCandidates = candidates
        .filter((c) => c.isExcluded)
        .sort((a, b) => b.score - a.score);

      const combined = [...unreadCandidates, ...readCandidates].slice(0, limit);
      return combined.map((c) => c.card);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Fallo en cálculo de recomendaciones para '${slug}': ${msg}`,
      );
      return [];
    }
  }

  private async findSourceArticle(
    slug: string,
    lang: string,
  ): Promise<{
    id: number;
    type: string;
    categoryDomain: string;
    category?: string;
  } | null> {
    for (const config of this.tableConfigs) {
      const rows: SourceRow[] = await this.dataSource.query<SourceRow[]>(
        `SELECT id, category FROM ${config.table} WHERE slug = ? AND language = ? LIMIT 1`,
        [slug, lang],
      );
      if (rows && rows.length > 0) {
        return {
          id: rows[0].id,
          type: config.type,
          categoryDomain: config.categoryDomain,
          category: rows[0].category,
        };
      }
    }
    return null;
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

  private formatSubcategory(cat?: string, isEn?: boolean): string {
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
      hardening: { es: 'BASTIONADO', en: 'HARDENING' },
    };
    const found = map[cat.toLowerCase()];
    if (found) return isEn ? found.en : found.es;
    return cat.replace(/_/g, ' ').toUpperCase();
  }

  private formatBadgeTag(
    metaTag: string | number | null | undefined,
    type: string,
    isEn: boolean,
  ): string {
    if (!metaTag && metaTag !== 0) return '';
    if (type === 'news' && metaTag === 1) return isEn ? 'BREAKING' : 'URGENTE';
    if (type === 'security') {
      const map: Record<string, string> = {
        CRITICAL: isEn ? 'CRITICAL' : 'CRÍTICO',
        HIGH: isEn ? 'HIGH' : 'ALTO',
        MEDIUM: isEn ? 'MEDIUM' : 'MEDIO',
        LOW: isEn ? 'LOW' : 'BAJO',
      };
      return (
        map[String(metaTag).toUpperCase()] || String(metaTag).toUpperCase()
      );
    }
    if (type === 'tutorial') {
      const map: Record<string, string> = {
        beginner: isEn ? 'BEGINNER' : 'PRINCIPIANTE',
        intermediate: isEn ? 'INTERMEDIATE' : 'INTERMEDIO',
        advanced: isEn ? 'ADVANCED' : 'AVANZADO',
      };
      return (
        map[String(metaTag).toLowerCase()] || String(metaTag).toUpperCase()
      );
    }
    return String(metaTag).toUpperCase();
  }
}
