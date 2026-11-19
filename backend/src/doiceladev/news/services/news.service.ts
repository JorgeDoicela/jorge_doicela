import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsArticle, NewsCategory } from '../entities/news-article.entity';
import { GetNewsQueryDto } from '../dto/get-news-query.dto';
import {
  aggregateModuleCategories,
  CategoryCountOption,
} from '../../common/utils/category-aggregation.util';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsArticle, 'doiceladevConnection')
    private readonly newsRepository: Repository<NewsArticle>,
  ) {}

  async findAll(query: GetNewsQueryDto = {}): Promise<NewsArticle[]> {
    const { category, tag, search, lang, sortBy = 'smart' } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.newsRepository.createQueryBuilder('news');

    if (lang) {
      qb.andWhere('news.language = :lang', { lang });
    }

    if (category && category !== 'all') {
      qb.andWhere('news.category = :category', { category });
    }

    if (tag && tag !== 'all') {
      qb.andWhere('news.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (search) {
      qb.andWhere(
        '(news.title LIKE :search OR news.excerpt LIKE :search OR news.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy === 'recent') {
      qb.orderBy('news.publishedAt', 'DESC');
      qb.addOrderBy('news.id', 'DESC');
    } else if (sortBy === 'popular') {
      qb.orderBy('news.views', 'DESC');
      qb.addOrderBy('news.likes', 'DESC');
      qb.addOrderBy('news.id', 'DESC');
    } else {
      qb.addSelect(
        '((news.featured * 1000) + (news.isBreaking * 500) + (news.orderPriority * 20) + (news.likes * 4) + (news.views * 1.5))',
        'smart_score',
      );
      qb.orderBy('smart_score', 'DESC');
      qb.addOrderBy('news.publishedAt', 'DESC');
      qb.addOrderBy('news.id', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll({ ...query, lang: 'es' });
    }

    return results;
  }

  async findOne(idOrSlug: string, lang?: string): Promise<NewsArticle> {
    const isId = !isNaN(Number(idOrSlug));
    let article: NewsArticle | null = null;

    if (isId) {
      article = await this.newsRepository.findOne({
        where: { id: Number(idOrSlug) },
      });
    } else {
      if (lang) {
        article = await this.newsRepository.findOne({
          where: { slug: idOrSlug, language: lang },
        });
      }
      if (!article) {
        article = await this.newsRepository.findOne({
          where: { slug: idOrSlug },
        });
      }
    }

    if (!article) {
      throw new NotFoundException(`Noticia "${idOrSlug}" no encontrada`);
    }

    void this.newsRepository.increment({ id: article.id }, 'views', 1);
    article.views += 1;
    return article;
  }

  async getCategories(lang: string = 'es'): Promise<CategoryCountOption[]> {
    const categoryOrder: NewsCategory[] = [
      'security',
      'ai',
      'frameworks',
      'cloud',
      'devops',
      'web',
      'databases',
      'tools',
    ];
    return aggregateModuleCategories(
      this.newsRepository.createQueryBuilder('news'),
      'news',
      lang,
      categoryOrder,
    );
  }
}
