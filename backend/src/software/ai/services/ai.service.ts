import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiResource, AiResourceType } from '../entities/ai-resource.entity';
import { CreateAiResourceDto } from '../dto/create-ai-resource.dto';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AiResource, 'softwareConnection')
    private readonly aiRepository: Repository<AiResource>,
  ) {}

  async findAll(
    type?: AiResourceType,
    search?: string,
    lang?: string,
  ): Promise<AiResource[]> {
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

    qb.orderBy('ai.createdAt', 'DESC');
    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll(type, search, 'es');
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

    resource.views += 1;
    await this.aiRepository.save(resource);
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
    await this.aiRepository.delete(id);
  }
}
