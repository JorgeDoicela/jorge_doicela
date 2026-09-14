import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ArchaeologyArticleEntity } from '../entities/archaeology-article.entity';

@Injectable()
export class ArchaeologyService {
  constructor(
    @InjectRepository(ArchaeologyArticleEntity, 'bibleConnection')
    private readonly articlesRepo: Repository<ArchaeologyArticleEntity>,
  ) {}

  async getArticles(
    category?: string,
    query?: string,
    lang?: string,
  ): Promise<ArchaeologyArticleEntity[]> {
    const qb = this.articlesRepo.createQueryBuilder('article');
    if (lang) {
      qb.andWhere('article.language = :lang', { lang });
    }
    if (category && category !== 'all') {
      qb.andWhere('article.category = :category', { category });
    }
    if (query && query.trim()) {
      qb.andWhere('(article.title LIKE :q OR article.summary LIKE :q)', {
        q: `%${query.trim()}%`,
      });
    }
    qb.orderBy('article.publishDate', 'DESC');
    return qb.getMany();
  }

  async getArticleBySlug(
    slug: string,
    lang?: string,
  ): Promise<ArchaeologyArticleEntity | null> {
    const where: FindOptionsWhere<ArchaeologyArticleEntity> = { slug };
    if (lang) {
      where.language = lang;
    }
    return this.articlesRepo.findOne({ where });
  }
}
