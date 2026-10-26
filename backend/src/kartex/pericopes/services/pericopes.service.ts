import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pericope } from '../entities/pericope.entity';
import { GetPericopesFilterDto } from '../dto/get-pericopes-filter.dto';

@Injectable()
export class PericopesService {
  constructor(
    @InjectRepository(Pericope, 'kartexConnection')
    private readonly pericopeRepository: Repository<Pericope>,
  ) {}

  async findFiltered(filterDto: GetPericopesFilterDto): Promise<Pericope[]> {
    const { bookId, chapter } = filterDto;
    const query = this.pericopeRepository
      .createQueryBuilder('pericope')
      .leftJoinAndSelect('pericope.book', 'book');

    if (bookId !== undefined) {
      query.andWhere('book.id = :bookId', { bookId });
    }
    if (chapter !== undefined) {
      query.andWhere('pericope.chapter = :chapter', { chapter });
    }

    query
      .orderBy('pericope.chapter', 'ASC')
      .addOrderBy('pericope.startVerse', 'ASC')
      .addOrderBy('pericope.orderIndex', 'ASC');

    return query.getMany();
  }

  async findByChapter(bookId: number, chapter: number): Promise<Pericope[]> {
    return this.findFiltered({ bookId, chapter });
  }
}
