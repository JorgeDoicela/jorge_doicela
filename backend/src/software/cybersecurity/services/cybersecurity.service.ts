import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SecurityPost,
  SecuritySeverity,
  SecurityPostType,
} from '../entities/security-post.entity';
import { CreateSecurityPostDto } from '../dto/create-security-post.dto';

@Injectable()
export class CybersecurityService {
  constructor(
    @InjectRepository(SecurityPost, 'softwareConnection')
    private readonly securityRepository: Repository<SecurityPost>,
  ) {}

  async findAll(
    severity?: SecuritySeverity,
    postType?: SecurityPostType,
    search?: string,
    lang?: string,
  ): Promise<SecurityPost[]> {
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

    qb.orderBy('sec.createdAt', 'DESC');
    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll(severity, postType, search, 'es');
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

    post.views += 1;
    await this.securityRepository.save(post);
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
    await this.securityRepository.delete(id);
  }
}
