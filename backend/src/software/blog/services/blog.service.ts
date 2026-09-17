import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from '../entities/blog-post.entity';
import { CreateBlogPostDto } from '../dto/create-blog-post.dto';
import { GetBlogQueryDto } from '../dto/get-blog-query.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost, 'softwareConnection')
    private readonly blogRepository: Repository<BlogPost>,
  ) {}

  async findAll(query: GetBlogQueryDto = {}): Promise<BlogPost[]> {
    const { search, series, tag, category, lang } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.blogRepository.createQueryBuilder('blog');

    if (lang) {
      qb.andWhere('blog.language = :lang', { lang });
    }

    if (search) {
      qb.andWhere(
        '(blog.title LIKE :search OR blog.excerpt LIKE :search OR blog.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (series) {
      qb.andWhere('blog.series = :series', { series });
    }

    if (tag) {
      qb.andWhere('blog.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (category && category !== 'all') {
      qb.andWhere('(blog.tags LIKE :category OR blog.series LIKE :category)', {
        category: `%${category}%`,
      });
    }

    // Algoritmo de Inteligencia Editorial (SmartScore)
    qb.addSelect(
      '((blog.featured * 1000) + (blog.orderPriority * 20) + (blog.likes * 4) + (blog.views * 1.5))',
      'smart_score',
    );
    qb.orderBy('smart_score', 'DESC');
    qb.addOrderBy('COALESCE(blog.publishedAt, blog.createdAt)', 'DESC');
    qb.addOrderBy('blog.id', 'DESC');

    // Techo de seguridad de memoria para VPS 1 GB RAM
    qb.skip((page - 1) * limit).take(limit);

    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll({ ...query, lang: 'es' });
    }

    return results;
  }

  async findOne(idOrSlug: string, lang?: string): Promise<BlogPost> {
    const isId = !isNaN(Number(idOrSlug));
    let post: BlogPost | null = null;

    if (isId) {
      post = await this.blogRepository.findOne({
        where: { id: Number(idOrSlug) },
      });
    } else {
      if (lang) {
        post = await this.blogRepository.findOne({
          where: { slug: idOrSlug, language: lang },
        });
      }
      if (!post) {
        post = await this.blogRepository.findOne({ where: { slug: idOrSlug } });
      }
    }

    if (!post) {
      throw new NotFoundException(
        `Artículo de blog "${idOrSlug}" no encontrado`,
      );
    }

    void this.blogRepository.increment({ id: post.id }, 'views', 1);
    post.views += 1;
    return post;
  }

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const post = this.blogRepository.create(createBlogPostDto);
    return this.blogRepository.save(post);
  }

  async getCategories(
    lang: string = 'es',
  ): Promise<Array<{ id: string; label: string; count: number }>> {
    const qb = this.blogRepository.createQueryBuilder('blog');
    if (lang) {
      qb.andWhere('blog.language = :lang', { lang });
    }

    const allPosts = await qb.select(['blog.series', 'blog.tags']).getMany();

    const seriesCountMap = new Map<string, number>();
    const tagCountMap = new Map<string, number>();

    for (const post of allPosts) {
      if (post.series) {
        const s = post.series.trim().toLowerCase();
        seriesCountMap.set(s, (seriesCountMap.get(s) || 0) + 1);
      }
      if (post.tags) {
        const splitTags = post.tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        for (const t of splitTags) {
          tagCountMap.set(t, (tagCountMap.get(t) || 0) + 1);
        }
      }
    }

    const labelsEs: Record<string, string> = {
      all: 'Todos los artículos',
      architecture: 'Arquitectura de Software',
      'clean-code': 'Código Limpio',
      nestjs: 'NestJS & Microservicios',
      database: 'Bases de Datos & SQL',
      devsecops: 'DevSecOps & Linux',
      microservices: 'Microservicios',
      performance: 'Alto Rendimiento',
    };

    const labelsEn: Record<string, string> = {
      all: 'All Articles',
      architecture: 'Software Architecture',
      'clean-code': 'Clean Code',
      nestjs: 'NestJS & Microservices',
      database: 'Databases & SQL',
      devsecops: 'DevSecOps & Linux',
      microservices: 'Microservices',
      performance: 'High Performance',
    };

    const labels = lang === 'en' ? labelsEn : labelsEs;

    const result: Array<{ id: string; label: string; count: number }> = [
      {
        id: 'all',
        label:
          labels.all ||
          (lang === 'en' ? 'All Articles' : 'Todos los artículos'),
        count: allPosts.length,
      },
    ];

    // Series registradas
    for (const [s, count] of seriesCountMap.entries()) {
      if (s !== 'all') {
        result.push({
          id: s,
          label: labels[s] || this.formatLabel(s),
          count,
        });
      }
    }

    // Tags que no estén duplicados
    for (const [tag, count] of tagCountMap.entries()) {
      if (!result.some((r) => r.id === tag)) {
        result.push({
          id: tag,
          label: labels[tag] || this.formatLabel(tag),
          count,
        });
      }
    }

    return result;
  }

  private formatLabel(slug: string): string {
    return slug
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async remove(id: number): Promise<void> {
    const result = await this.blogRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Artículo #${id} no encontrado`);
    }
  }
}
