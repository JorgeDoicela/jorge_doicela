import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SecurityPost,
  SecurityCategory,
} from '../entities/security-post.entity';
import { GetSecurityPostsQueryDto } from '../dto/get-security-posts-query.dto';
import {
  aggregateModuleCategories,
  CategoryCountOption,
} from '../../common/utils/category-aggregation.util';

@Injectable()
export class CybersecurityService {
  constructor(
    @InjectRepository(SecurityPost, 'doiceladevConnection')
    private readonly securityRepository: Repository<SecurityPost>,
  ) {}

  async findAll(query: GetSecurityPostsQueryDto = {}): Promise<SecurityPost[]> {
    const { category, tag, search, lang, sortBy = 'smart' } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.securityRepository.createQueryBuilder('sec');

    if (lang) {
      qb.andWhere('sec.language = :lang', { lang });
    }

    if (category && category !== 'all') {
      qb.andWhere('sec.category = :category', { category });
    }

    if (tag && tag !== 'all') {
      qb.andWhere('sec.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (search) {
      qb.andWhere(
        '(sec.title LIKE :search OR sec.excerpt LIKE :search OR sec.cveId LIKE :search OR sec.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy === 'recent') {
      qb.orderBy('sec.publishedAt', 'DESC');
      qb.addOrderBy('sec.id', 'DESC');
    } else if (sortBy === 'popular') {
      qb.orderBy('sec.views', 'DESC');
      qb.addOrderBy('sec.likes', 'DESC');
      qb.addOrderBy('sec.id', 'DESC');
    } else {
      qb.addSelect(
        '((sec.featured * 1000) + (sec.orderPriority * 20) + (sec.likes * 4) + (sec.views * 1.5))',
        'smart_score',
      );
      qb.orderBy('smart_score', 'DESC');
      qb.addOrderBy('sec.publishedAt', 'DESC');
      qb.addOrderBy('sec.id', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll({ ...query, lang: 'es' });
    }

    return results;
  }

  async findOne(idOrSlug: string, lang?: string): Promise<SecurityPost> {
    const isId = !isNaN(Number(idOrSlug));
    let post: SecurityPost | null = null;

    if (isId) {
      post = await this.securityRepository.findOne({
        where: { id: Number(idOrSlug) },
      });
    } else {
      if (lang) {
        post = await this.securityRepository.findOne({
          where: { slug: idOrSlug, language: lang },
        });
      }
      if (!post) {
        post = await this.securityRepository.findOne({
          where: { slug: idOrSlug },
        });
      }
    }

    if (!post) {
      throw new NotFoundException(
        `Publicación de ciberseguridad "${idOrSlug}" no encontrada`,
      );
    }

    void this.securityRepository.increment({ id: post.id }, 'views', 1);
    post.views += 1;
    return post;
  }

  async getCategories(lang: string = 'es'): Promise<CategoryCountOption[]> {
    const categoryOrder: SecurityCategory[] = [
      'advisory',
      'hardening_guide',
      'cve_analysis',
      'writeup',
      'pentest',
    ];
    return aggregateModuleCategories(
      this.securityRepository.createQueryBuilder('sec'),
      'sec',
      lang,
      categoryOrder,
    );
  }
}
