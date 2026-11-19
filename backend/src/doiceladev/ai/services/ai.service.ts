import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiResource, AiCategory } from '../entities/ai-resource.entity';
import { GetAiResourcesQueryDto } from '../dto/get-ai-resources-query.dto';
import {
  aggregateModuleCategories,
  CategoryCountOption,
} from '../../common/utils/category-aggregation.util';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AiResource, 'doiceladevConnection')
    private readonly aiRepository: Repository<AiResource>,
  ) {}

  async findAll(query: GetAiResourcesQueryDto = {}): Promise<AiResource[]> {
    const { category, tag, search, lang, sortBy = 'smart' } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.aiRepository.createQueryBuilder('ai');

    if (lang) {
      qb.andWhere('ai.language = :lang', { lang });
    }

    if (category && category !== 'all') {
      qb.andWhere('ai.category = :category', { category });
    }

    if (tag && tag !== 'all') {
      qb.andWhere('ai.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (search) {
      qb.andWhere(
        '(ai.title LIKE :search OR ai.excerpt LIKE :search OR ai.tags LIKE :search OR ai.provider LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy === 'recent') {
      qb.orderBy('ai.publishedAt', 'DESC');
      qb.addOrderBy('ai.id', 'DESC');
    } else if (sortBy === 'popular') {
      qb.orderBy('ai.views', 'DESC');
      qb.addOrderBy('ai.likes', 'DESC');
      qb.addOrderBy('ai.id', 'DESC');
    } else {
      qb.addSelect(
        '((ai.featured * 1000) + (ai.orderPriority * 20) + (ai.likes * 4) + (ai.views * 1.5))',
        'smart_score',
      );
      qb.orderBy('smart_score', 'DESC');
      qb.addOrderBy('ai.publishedAt', 'DESC');
      qb.addOrderBy('ai.id', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll({ ...query, lang: 'es' });
    }

    return results;
  }

  async findOne(idOrSlug: string, lang?: string): Promise<AiResource> {
    const isId = !isNaN(Number(idOrSlug));
    let resource: AiResource | null = null;

    if (isId) {
      resource = await this.aiRepository.findOne({
        where: { id: Number(idOrSlug) },
      });
    } else {
      if (lang) {
        resource = await this.aiRepository.findOne({
          where: { slug: idOrSlug, language: lang },
        });
      }
      if (!resource) {
        resource = await this.aiRepository.findOne({
          where: { slug: idOrSlug },
        });
      }
    }

    if (!resource) {
      throw new NotFoundException(`Recurso de IA "${idOrSlug}" no encontrado`);
    }

    void this.aiRepository.increment({ id: resource.id }, 'views', 1);
    resource.views += 1;
    return resource;
  }

  async getCategories(lang: string = 'es'): Promise<CategoryCountOption[]> {
    const categoryOrder: AiCategory[] = [
      'llm',
      'agent',
      'mcp_server',
      'tool',
      'framework',
      'dataset',
      'platform',
    ];
    return aggregateModuleCategories(
      this.aiRepository.createQueryBuilder('ai'),
      'ai',
      lang,
      categoryOrder,
    );
  }
}
