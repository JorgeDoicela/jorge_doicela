import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsArticle } from '../entities/news-article.entity';
import { CreateNewsDto } from '../dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsArticle, 'softwareConnection')
    private readonly newsRepository: Repository<NewsArticle>,
  ) {}

  async findAll(
    search?: string,
    tag?: string,
    lang?: string,
  ): Promise<NewsArticle[]> {
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

    if (tag) {
      qb.andWhere('news.tags LIKE :tag', { tag: `%${tag}%` });
    }

    qb.orderBy('news.publishedAt', 'DESC');
    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll(search, tag, 'es');
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

    article.views += 1;
    await this.newsRepository.save(article);
    return article;
  }

  async create(createNewsDto: CreateNewsDto): Promise<NewsArticle> {
    const article = this.newsRepository.create(createNewsDto);
    return this.newsRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    await this.newsRepository.delete(id);
  }
}
