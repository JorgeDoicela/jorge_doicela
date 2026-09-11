import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvangelismPathwayEntity } from '../entities/evangelism-pathway.entity';
import { EvangelismObjectionEntity } from '../entities/evangelism-objection.entity';
import { EvangelismTractEntity } from '../entities/evangelism-tract.entity';

@Injectable()
export class EvangelismService {
  constructor(
    @InjectRepository(EvangelismPathwayEntity, 'bibleConnection')
    private readonly pathwaysRepo: Repository<EvangelismPathwayEntity>,
    @InjectRepository(EvangelismObjectionEntity, 'bibleConnection')
    private readonly objectionsRepo: Repository<EvangelismObjectionEntity>,
    @InjectRepository(EvangelismTractEntity, 'bibleConnection')
    private readonly tractsRepo: Repository<EvangelismTractEntity>,
  ) {}

  async getPathways(lang: string = 'es'): Promise<EvangelismPathwayEntity[]> {
    return this.pathwaysRepo.find({
      where: { language: lang },
      order: { id: 'ASC' },
    });
  }

  async getPathwayBySlug(
    slug: string,
    lang: string = 'es',
  ): Promise<EvangelismPathwayEntity | null> {
    return this.pathwaysRepo.findOne({
      where: [
        { slug, language: lang },
        { id: slug, language: lang },
      ],
    });
  }

  async getObjections(
    category?: string,
    query?: string,
    lang: string = 'es',
  ): Promise<EvangelismObjectionEntity[]> {
    const qb = this.objectionsRepo.createQueryBuilder('obj');
    qb.where('obj.language = :lang', { lang });

    if (category && category !== 'all') {
      qb.andWhere('obj.category = :category', { category });
    }

    if (query && query.trim()) {
      qb.andWhere(
        '(obj.question LIKE :q OR obj.summary LIKE :q OR obj.biblicalAnswer LIKE :q)',
        { q: `%${query.trim()}%` },
      );
    }

    qb.orderBy('obj.id', 'ASC');
    return qb.getMany();
  }

  async getTracts(
    targetAudience?: string,
    lang: string = 'es',
  ): Promise<EvangelismTractEntity[]> {
    const qb = this.tractsRepo.createQueryBuilder('tract');
    qb.where('tract.language = :lang', { lang });

    if (targetAudience && targetAudience !== 'all') {
      qb.andWhere('tract.targetAudience LIKE :aud', {
        aud: `%${targetAudience}%`,
      });
    }

    qb.orderBy('tract.id', 'ASC');
    return qb.getMany();
  }

  async getTractBySlug(
    slug: string,
    lang: string = 'es',
  ): Promise<EvangelismTractEntity | null> {
    return this.tractsRepo.findOne({
      where: [
        { slug, language: lang },
        { id: slug, language: lang },
      ],
    });
  }
}
