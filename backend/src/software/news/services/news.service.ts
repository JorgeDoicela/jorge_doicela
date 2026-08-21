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

  async findAll(search?: string, tag?: string): Promise<NewsArticle[]> {
    const qb = this.newsRepository.createQueryBuilder('news');

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
    return qb.getMany();
  }

  async findOne(idOrSlug: string): Promise<NewsArticle> {
    const isId = !isNaN(Number(idOrSlug));
    const article = isId
      ? await this.newsRepository.findOne({ where: { id: Number(idOrSlug) } })
      : await this.newsRepository.findOne({ where: { slug: idOrSlug } });

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
