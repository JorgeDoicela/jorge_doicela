import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlossaryTerm } from '../entities/glossary-term.entity';
import { GetGlossaryQueryDto } from '../dto/get-glossary-query.dto';

@Injectable()
export class GlossaryService {
  constructor(
    @InjectRepository(GlossaryTerm, 'softwareConnection')
    private readonly glossaryRepo: Repository<GlossaryTerm>,
  ) {}

  async findAll(query: GetGlossaryQueryDto): Promise<GlossaryTerm[]> {
    const lang = query.lang || 'es';
    const qb = this.glossaryRepo.createQueryBuilder('term');

    qb.where('term.language = :lang', { lang });

    if (query.category) {
      qb.andWhere('term.category = :category', { category: query.category });
    }

    qb.orderBy('term.orderPriority', 'DESC')
      .addOrderBy('LENGTH(term.term)', 'DESC')
      .addOrderBy('term.term', 'ASC');

    return qb.getMany();
  }

  async findBySlug(
    slug: string,
    lang: string = 'es',
  ): Promise<GlossaryTerm | null> {
    return this.glossaryRepo.findOne({
      where: { slug, language: lang },
    });
  }
}
