import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost, BlogCategory } from '../entities/blog-post.entity';
import { GetBlogQueryDto } from '../dto/get-blog-query.dto';
import {
  aggregateModuleCategories,
  CategoryCountOption,
} from '../../common/utils/category-aggregation.util';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost, 'doiceladevConnection')
    private readonly blogRepository: Repository<BlogPost>,
  ) {}

  async findAll(query: GetBlogQueryDto = {}): Promise<BlogPost[]> {
    const { search, series, tag, category, lang, sortBy = 'smart' } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.blogRepository.createQueryBuilder('blog');

    if (lang) {
      qb.andWhere('blog.language = :lang', { lang });
    }

    if (category && category !== 'all') {
      qb.andWhere('blog.category = :category', { category });
    }

    if (series) {
      qb.andWhere('blog.series = :series', { series });
    }

    if (tag && tag !== 'all') {
      qb.andWhere('blog.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (search) {
      qb.andWhere(
        '(blog.title LIKE :search OR blog.excerpt LIKE :search OR blog.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy === 'recent') {
      qb.orderBy('blog.publishedAt', 'DESC');
      qb.addOrderBy('blog.id', 'DESC');
    } else if (sortBy === 'popular') {
      qb.orderBy('blog.views', 'DESC');
      qb.addOrderBy('blog.likes', 'DESC');
      qb.addOrderBy('blog.id', 'DESC');
    } else {
      qb.addSelect(
        '((blog.featured * 1000) + (blog.orderPriority * 20) + (blog.likes * 4) + (blog.views * 1.5))',
        'smart_score',
      );
      qb.orderBy('smart_score', 'DESC');
      qb.addOrderBy('blog.publishedAt', 'DESC');
      qb.addOrderBy('blog.id', 'DESC');
    }

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

  async getCategories(lang: string = 'es'): Promise<CategoryCountOption[]> {
    const categoryOrder: BlogCategory[] = [
      'opinion',
      'lessons',
      'postmortems',
      'career',
      'journal',
    ];
    return aggregateModuleCategories(
      this.blogRepository.createQueryBuilder('blog'),
      'blog',
      lang,
      categoryOrder,
    );
  }
}
