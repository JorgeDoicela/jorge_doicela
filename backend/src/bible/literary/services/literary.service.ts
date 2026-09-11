import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChiasmStructureEntity } from '../entities/chiasm-structure.entity';
import { PaulineDiscourseEntity } from '../entities/pauline-discourse.entity';

@Injectable()
export class LiteraryService {
  constructor(
    @InjectRepository(ChiasmStructureEntity, 'bibleConnection')
    private readonly chiasmsRepo: Repository<ChiasmStructureEntity>,
    @InjectRepository(PaulineDiscourseEntity, 'bibleConnection')
    private readonly paulineRepo: Repository<PaulineDiscourseEntity>,
  ) {}

  async getChiasms(
    lang?: string,
    bookAbbreviation?: string,
  ): Promise<ChiasmStructureEntity[]> {
    const qb = this.chiasmsRepo.createQueryBuilder('c');
    if (lang) {
      qb.andWhere('c.language = :lang', { lang });
    }
    if (bookAbbreviation) {
      qb.andWhere('c.bookAbbreviation = :book', { book: bookAbbreviation });
    }
    return qb.getMany();
  }

  async getChiasmById(
    id: string,
    lang?: string,
  ): Promise<ChiasmStructureEntity | null> {
    const where: Record<string, string> = { id };
    if (lang) {
      where.language = lang;
    }
    return this.chiasmsRepo.findOne({ where });
  }

  async getPaulineDiscourses(
    lang?: string,
    epistle?: string,
  ): Promise<PaulineDiscourseEntity[]> {
    const qb = this.paulineRepo.createQueryBuilder('p');
    if (lang) {
      qb.andWhere('p.language = :lang', { lang });
    }
    if (epistle) {
      qb.andWhere('p.bookAbbreviation = :epistle', { epistle });
    }
    return qb.getMany();
  }

  async getPaulineDiscourseById(
    id: string,
    lang?: string,
  ): Promise<PaulineDiscourseEntity | null> {
    const where: Record<string, string> = { id };
    if (lang) {
      where.language = lang;
    }
    return this.paulineRepo.findOne({ where });
  }
}
