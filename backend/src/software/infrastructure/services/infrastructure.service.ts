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
    sortBy?: 'smart' | 'recent' | 'views' | 'likes' | 'difficulty',
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

    // Ordenamiento Inteligente Enterprise
    if (sortBy === 'recent') {
      qb.orderBy('COALESCE(infra.publishedAt, infra.createdAt)', 'DESC');
      qb.addOrderBy('infra.id', 'DESC');
    } else if (sortBy === 'views') {
      qb.orderBy('infra.views', 'DESC');
      qb.addOrderBy('infra.likes', 'DESC');
      qb.addOrderBy('infra.id', 'DESC');
    } else if (sortBy === 'likes') {
      qb.orderBy('infra.likes', 'DESC');
      qb.addOrderBy('infra.views', 'DESC');
      qb.addOrderBy('infra.id', 'DESC');
    } else if (sortBy === 'difficulty') {
      // Ordenar por complejidad técnica (expert -> advanced -> intermediate -> beginner)
      qb.orderBy(
        `CASE infra.difficulty 
          WHEN 'expert' THEN 4 
          WHEN 'advanced' THEN 3 
          WHEN 'intermediate' THEN 2 
          WHEN 'beginner' THEN 1 
          ELSE 0 END`,
        'DESC',
      );
      qb.addOrderBy('infra.views', 'DESC');
    } else {
      // Algoritmo de Inteligencia Editorial ('smart' por defecto)
      // Prioriza: 1. Destacados (featured) -> 2. Peso Editorial (orderPriority) -> 3. Ponderación engagement (likes*3 + views) -> 4. Recientes
      qb.addSelect(
        '((infra.featured * 1000) + (infra.orderPriority * 20) + (infra.likes * 4) + (infra.views * 1.5))',
        'smart_score',
      );
      qb.orderBy('smart_score', 'DESC');
      qb.addOrderBy('COALESCE(infra.publishedAt, infra.createdAt)', 'DESC');
      qb.addOrderBy('infra.id', 'DESC');
    }

    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll(
        category,
        environment,
        difficulty,
        search,
        'es',
        sortBy,
      );
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
      featured: createDto.featured ?? false,
      orderPriority: createDto.orderPriority ?? 0,
      publishedAt: createDto.publishedAt
        ? new Date(createDto.publishedAt)
        : new Date(),
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
