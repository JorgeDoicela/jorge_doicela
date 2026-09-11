import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InfrastructurePost,
  InfrastructureCategory,
  InfrastructureEnvironment,
  InfrastructureDifficulty,
} from '../entities/infrastructure-post.entity';
import { CreateInfrastructurePostDto } from '../dto/create-infrastructure-post.dto';

@Injectable()
export class InfrastructureService {
  constructor(
    @InjectRepository(InfrastructurePost, 'softwareConnection')
    private readonly infraRepository: Repository<InfrastructurePost>,
  ) {}

  async findAll(
    category?: InfrastructureCategory,
    environment?: InfrastructureEnvironment,
    difficulty?: InfrastructureDifficulty,
    search?: string,
    lang?: string,
  ): Promise<InfrastructurePost[]> {
    const qb = this.infraRepository.createQueryBuilder('infra');

    if (lang) {
      qb.andWhere('infra.language = :lang', { lang });
    }

    if (category) {
      qb.andWhere('infra.category = :category', { category });
    }

    if (environment) {
      qb.andWhere('infra.environment = :environment', { environment });
    }

    if (difficulty) {
      qb.andWhere('infra.difficulty = :difficulty', { difficulty });
    }

    if (search) {
      qb.andWhere(
        '(infra.title LIKE :search OR infra.subtitle LIKE :search OR infra.techStack LIKE :search OR infra.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('infra.createdAt', 'DESC');
    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll(category, environment, difficulty, search, 'es');
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

    post.views += 1;
    await this.infraRepository.save(post);
    return post;
  }

  async create(
    createDto: CreateInfrastructurePostDto,
  ): Promise<InfrastructurePost> {
    const post = this.infraRepository.create({
      ...createDto,
      category: createDto.category || 'servers',
      environment: createDto.environment || 'production',
      difficulty: createDto.difficulty || 'intermediate',
    });
    return this.infraRepository.save(post);
  }

  async like(id: number): Promise<InfrastructurePost> {
    const post = await this.infraRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Guía con id ${id} no encontrada`);
    }
    post.likes += 1;
    return this.infraRepository.save(post);
  }

  async getCategories(
    lang?: string,
  ): Promise<{ category: string; count: number }[]> {
    const qb = this.infraRepository
      .createQueryBuilder('infra')
      .select('infra.category', 'category')
      .addSelect('COUNT(infra.id)', 'count');

    if (lang) {
      qb.where('infra.language = :lang', { lang });
    }

    qb.groupBy('infra.category');
    const raw = await qb.getRawMany<{
      category: string;
      count: string | number;
    }>();
    return raw.map((r) => ({
      category: String(r.category),
      count: Number(r.count),
    }));
  }

  async remove(id: number): Promise<void> {
    await this.infraRepository.delete(id);
  }
}
