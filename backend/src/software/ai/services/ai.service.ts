import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiResource, AiResourceType } from '../entities/ai-resource.entity';
import { CreateAiResourceDto } from '../dto/create-ai-resource.dto';
import { GetAiResourcesQueryDto } from '../dto/get-ai-resources-query.dto';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AiResource, 'softwareConnection')
    private readonly aiRepository: Repository<AiResource>,
  ) {}

  async findAll(query: GetAiResourcesQueryDto = {}): Promise<AiResource[]> {
    const { type, search, lang } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.aiRepository.createQueryBuilder('ai');

    if (lang) {
      qb.andWhere('ai.language = :lang', { lang });
    }

    if (type) {
      qb.andWhere('ai.type = :type', { type });
    }

    if (search) {
      qb.andWhere(
        '(ai.name LIKE :search OR ai.description LIKE :search OR ai.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Algoritmo de Inteligencia Editorial (SmartScore)
    qb.addSelect(
      '((ai.featured * 1000) + (ai.orderPriority * 20) + (ai.likes * 4) + (ai.views * 1.5))',
      'smart_score',
    );
    qb.orderBy('smart_score', 'DESC');
    qb.addOrderBy('COALESCE(ai.publishedAt, ai.createdAt)', 'DESC');
    qb.addOrderBy('ai.id', 'DESC');

    // Techo de seguridad de memoria para VPS 1 GB RAM
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

  async create(createAiResourceDto: CreateAiResourceDto): Promise<AiResource> {
    const resource = this.aiRepository.create({
      ...createAiResourceDto,
      type: (createAiResourceDto.type || 'tool') as AiResourceType,
    });
    return this.aiRepository.save(resource);
  }

  async remove(id: number): Promise<void> {
    const result = await this.aiRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Recurso de IA #${id} no encontrado`);
    }
  }
}
