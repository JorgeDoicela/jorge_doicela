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
  ): Promise<SecurityPost[]> {
    const qb = this.securityRepository.createQueryBuilder('sec');

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
    return qb.getMany();
  }

  async findOne(idOrSlug: string): Promise<SecurityPost> {
    const isId = !isNaN(Number(idOrSlug));
    const post = isId
      ? await this.securityRepository.findOne({
          where: { id: Number(idOrSlug) },
        })
      : await this.securityRepository.findOne({ where: { slug: idOrSlug } });

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
