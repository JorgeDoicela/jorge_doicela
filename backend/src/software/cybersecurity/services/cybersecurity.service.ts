import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityPost } from '../entities/security-post.entity';
import { CreateSecurityPostDto } from '../dto/create-security-post.dto';
import { GetSecurityPostsQueryDto } from '../dto/get-security-posts-query.dto';

@Injectable()
export class CybersecurityService {
  constructor(
    @InjectRepository(SecurityPost, 'softwareConnection')
    private readonly securityRepository: Repository<SecurityPost>,
  ) {}

  async findAll(query: GetSecurityPostsQueryDto = {}): Promise<SecurityPost[]> {
    const { severity, postType, search, lang } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.securityRepository.createQueryBuilder('sec');

    if (lang) {
      qb.andWhere('sec.language = :lang', { lang });
    }

    if (severity) {
      qb.andWhere('sec.severity = :severity', { severity });
    }

    if (postType) {
      qb.andWhere('sec.postType = :postType', { postType });
    }

    if (search) {
      qb.andWhere(
        '(sec.title LIKE :search OR sec.excerpt LIKE :search OR sec.cveId LIKE :search OR sec.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Algoritmo de Inteligencia Editorial (SmartScore con ponderación CVE)
    qb.addSelect(
      `((sec.featured * 1000) + (CASE sec.severity WHEN 'CRITICAL' THEN 300 WHEN 'HIGH' THEN 150 WHEN 'MEDIUM' THEN 50 ELSE 0 END) + (sec.orderPriority * 20) + (sec.likes * 4) + (sec.views * 1.5))`,
      'smart_score',
    );
    qb.orderBy('smart_score', 'DESC');
    qb.addOrderBy('COALESCE(sec.publishedAt, sec.createdAt)', 'DESC');
    qb.addOrderBy('sec.id', 'DESC');

    // Techo de seguridad de memoria para VPS 1 GB RAM
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

  async create(
    createSecurityPostDto: CreateSecurityPostDto,
  ): Promise<SecurityPost> {
    const post = this.securityRepository.create({
      ...createSecurityPostDto,
      severity: createSecurityPostDto.severity || 'MEDIUM',
      postType: createSecurityPostDto.postType || 'advisory',
    });
    return this.securityRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const result = await this.securityRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(
        `Publicación de ciberseguridad #${id} no encontrada`,
      );
    }
  }
}
