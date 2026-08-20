import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleCategory } from '../entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article, 'softwareConnection')
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findAll(
    category?: ArticleCategory,
    search?: string,
  ): Promise<Article[]> {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (category) {
      queryBuilder.andWhere('article.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(article.title LIKE :search OR article.excerpt LIKE :search OR article.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('article.createdAt', 'DESC');
    return queryBuilder.getMany();
  }

  async findOne(idOrSlug: string): Promise<Article> {
    const isId = !isNaN(Number(idOrSlug));
    const article = isId
      ? await this.articleRepository.findOne({
          where: { id: Number(idOrSlug) },
        })
      : await this.articleRepository.findOne({ where: { slug: idOrSlug } });

    if (!article) {
      throw new NotFoundException(
        `Artículo con ID o slug "${idOrSlug}" no fue encontrado`,
      );
    }

    // Incrementar contador de visualizaciones
    article.views += 1;
    await this.articleRepository.save(article);

    return article;
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      category: createArticleDto.category as ArticleCategory,
    });
    return await this.articleRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
