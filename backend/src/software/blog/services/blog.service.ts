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
    const { search, series, lang } = query;
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

  async remove(id: number): Promise<void> {
    const result = await this.blogRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Artículo de blog #${id} no encontrado`);
    }
  }
}
