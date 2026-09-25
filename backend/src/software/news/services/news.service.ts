import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsArticle } from '../entities/news-article.entity';
import { CreateNewsDto } from '../dto/create-news.dto';
import { GetNewsQueryDto } from '../dto/get-news-query.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsArticle, 'softwareConnection')
    private readonly newsRepository: Repository<NewsArticle>,
  ) {}

  async findAll(query: GetNewsQueryDto = {}): Promise<NewsArticle[]> {
    const { search, tag, category, lang } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.newsRepository.createQueryBuilder('news');

    if (lang) {
      qb.andWhere('news.language = :lang', { lang });
    }

    if (search) {
      qb.andWhere(
        '(news.title LIKE :search OR news.excerpt LIKE :search OR news.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category && category !== 'all') {
      qb.andWhere('(news.category = :category OR news.tags LIKE :catPattern)', {
        category,
        catPattern: `%${category}%`,
      });
    }

    if (tag && tag !== 'all') {
      qb.andWhere('news.tags LIKE :tag', { tag: `%${tag}%` });
    }

    // Algoritmo de Inteligencia Editorial (SmartScore)
    qb.addSelect(
      '((news.featured * 1000) + (news.isBreaking * 500) + (news.orderPriority * 20) + (news.likes * 4) + (news.views * 1.5))',
      'smart_score',
    );
    qb.orderBy('smart_score', 'DESC');
    qb.addOrderBy('COALESCE(news.publishedAt, news.createdAt)', 'DESC');
    qb.addOrderBy('news.id', 'DESC');

    // Techo de seguridad de memoria para VPS 1 GB RAM
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

  async create(createNewsDto: CreateNewsDto): Promise<NewsArticle> {
    const article = this.newsRepository.create(createNewsDto);
    return this.newsRepository.save(article);
  }

  async getCategories(
    lang: string = 'es',
  ): Promise<Array<{ id: string; label: string; count: number }>> {
    // 1. Obtener todas las noticias del idioma correspondiente
    const allArticles = await this.newsRepository.find({
      where: { language: lang },
      select: { id: true, category: true, tags: true },
    });

    const categoryCountMap = new Map<string, number>();
    const tagCountMap = new Map<string, number>();

    for (const art of allArticles) {
      if (art.category) {
        const cat = art.category.trim().toLowerCase();
        categoryCountMap.set(cat, (categoryCountMap.get(cat) || 0) + 1);
      }
      if (art.tags) {
        const splitTags = art.tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        for (const t of splitTags) {
          tagCountMap.set(t, (tagCountMap.get(t) || 0) + 1);
        }
      }
    }

    const result: Array<{ id: string; label: string; count: number }> = [
      {
        id: 'all',
        label: 'all',
        count: allArticles.length,
      },
    ];

    // Categorías primarias registradas
    for (const [cat, count] of categoryCountMap.entries()) {
      if (cat !== 'all') {
        result.push({
          id: cat,
          label: cat,
          count,
        });
      }
    }

    // Tags relevantes que no estén como categoría primaria
    for (const [tag, count] of tagCountMap.entries()) {
      if (!result.some((r) => r.id === tag)) {
        result.push({
          id: tag,
          label: tag,
          count,
        });
      }
    }

    return result;
  }

  async remove(id: number): Promise<void> {
    const result = await this.newsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Noticia #${id} no encontrada`);
    }
  }
}
