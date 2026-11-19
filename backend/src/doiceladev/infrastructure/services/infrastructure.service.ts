import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InfrastructurePost,
  InfrastructureCategory,
} from '../entities/infrastructure-post.entity';
import { GetInfrastructureQueryDto } from '../dto/get-infrastructure-query.dto';
import {
  aggregateModuleCategories,
  CategoryCountOption,
} from '../../common/utils/category-aggregation.util';

@Injectable()
export class InfrastructureService {
  constructor(
    @InjectRepository(InfrastructurePost, 'doiceladevConnection')
    private readonly infraRepository: Repository<InfrastructurePost>,
  ) {}

  async findAll(
    query: GetInfrastructureQueryDto = {},
  ): Promise<InfrastructurePost[]> {
    const { category, tag, search, lang, sortBy = 'smart' } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.infraRepository.createQueryBuilder('infra');

    if (lang) {
      qb.andWhere('infra.language = :lang', { lang });
    }

    if (category && category !== 'all') {
      qb.andWhere('infra.category = :category', { category });
    }

    if (tag && tag !== 'all') {
      qb.andWhere('infra.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (search) {
      qb.andWhere(
        '(infra.title LIKE :search OR infra.excerpt LIKE :search OR infra.techStack LIKE :search OR infra.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy === 'recent') {
      qb.orderBy('infra.publishedAt', 'DESC');
      qb.addOrderBy('infra.id', 'DESC');
    } else if (sortBy === 'popular') {
      qb.orderBy('infra.views', 'DESC');
      qb.addOrderBy('infra.likes', 'DESC');
      qb.addOrderBy('infra.id', 'DESC');
    } else {
      qb.addSelect(
        '((infra.featured * 1000) + (infra.orderPriority * 20) + (infra.likes * 4) + (infra.views * 1.5))',
        'smart_score',
      );
      qb.orderBy('smart_score', 'DESC');
      qb.addOrderBy('infra.publishedAt', 'DESC');
      qb.addOrderBy('infra.id', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll({ ...query, lang: 'es' });
    }

    return results;
  }

  async findOne(idOrSlug: string, lang?: string): Promise<InfrastructurePost> {
    const isId = !isNaN(Number(idOrSlug));
    let post: InfrastructurePost | null = null;

    if (isId) {
      post = await this.infraRepository.findOne({
        where: { id: Number(idOrSlug) },
      });
    } else {
      if (lang) {
        post = await this.infraRepository.findOne({
          where: { slug: idOrSlug, language: lang },
        });
      }
      if (!post) {
        post = await this.infraRepository.findOne({
          where: { slug: idOrSlug },
        });
      }
    }

    if (!post) {
      throw new NotFoundException(
        `Guía de infraestructura "${idOrSlug}" no encontrada`,
      );
    }

    void this.infraRepository.increment({ id: post.id }, 'views', 1);
    post.views += 1;
    return post;
  }

  async getCategories(lang: string = 'es'): Promise<CategoryCountOption[]> {
    const categoryOrder: InfrastructureCategory[] = [
      'servers',
      'hardening',
      'networking',
      'containers',
      'cloud',
      'ci_cd',
      'zero_ram',
      'monitoring',
      'security',
    ];
    return aggregateModuleCategories(
      this.infraRepository.createQueryBuilder('infra'),
      'infra',
      lang,
      categoryOrder,
    );
  }
}
