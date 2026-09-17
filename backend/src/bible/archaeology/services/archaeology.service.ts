import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchaeologyArticleEntity } from '../entities/archaeology-article.entity';
import { EntityNotFoundError } from '../../../common/domain/domain-errors';

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
    const targetLang = lang?.trim() || 'es';
    const qb = this.articlesRepo.createQueryBuilder('article');
    qb.where('article.language = :lang', { lang: targetLang });

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
  ): Promise<ArchaeologyArticleEntity> {
    const targetLang = lang?.trim() || 'es';
    const article = await this.articlesRepo.findOne({
      where: { slug, language: targetLang },
    });
    if (!article) {
      throw new EntityNotFoundError('ArchaeologyArticle', slug);
    }
    return article;
  }
}
