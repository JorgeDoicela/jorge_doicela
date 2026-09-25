import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfrastructurePost } from '../entities/infrastructure-post.entity';
import { CreateInfrastructurePostDto } from '../dto/create-infrastructure-post.dto';
import { GetInfrastructureQueryDto } from '../dto/get-infrastructure-query.dto';

@Injectable()
export class InfrastructureService {
  constructor(
    @InjectRepository(InfrastructurePost, 'softwareConnection')
    private readonly infraRepository: Repository<InfrastructurePost>,
  ) {}

  async findAll(
    query: GetInfrastructureQueryDto = {},
  ): Promise<InfrastructurePost[]> {
    const { category, environment, difficulty, search, lang, sortBy } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.infraRepository.createQueryBuilder('infra');

    if (lang) {
      qb.andWhere('infra.language = :lang', { lang });
    }

    if (category && category !== 'all') {
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

    // Techo de seguridad de memoria para VPS 1 GB RAM
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
    void this.infraRepository.increment({ id }, 'likes', 1);
    post.likes += 1;
    return post;
  }

  async getCategories(
    lang: string = 'es',
  ): Promise<Array<{ id: string; label: string; count: number }>> {
    const qb = this.infraRepository.createQueryBuilder('infra');
    if (lang) {
      qb.andWhere('infra.language = :lang', { lang });
    }

    const allPosts = await qb
      .select(['infra.category', 'infra.tags'])
      .getMany();

    const categoryCountMap = new Map<string, number>();

    for (const post of allPosts) {
      if (post.category) {
        const cat = post.category.trim().toLowerCase();
        categoryCountMap.set(cat, (categoryCountMap.get(cat) || 0) + 1);
      }
    }

    const result: Array<{ id: string; label: string; count: number }> = [
      {
        id: 'all',
        label: 'all',
        count: allPosts.length,
      },
    ];

    for (const [cat, count] of categoryCountMap.entries()) {
      if (cat !== 'all') {
        result.push({
          id: cat,
          label: cat,
          count,
        });
      }
    }

    return result;
  }

  async remove(id: number): Promise<void> {
    const result = await this.infraRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(
        `Guía de infraestructura #${id} no encontrada`,
      );
    }
  }
}
