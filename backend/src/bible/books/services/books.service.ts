import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { GetBooksFilterDto } from '../dto/get-books-filter.dto';
import {
  EntityNotFoundError,
  EntityConflictError,
} from '../../../common/domain/domain-errors';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book, 'bibleConnection')
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(filterDto?: GetBooksFilterDto): Promise<Book[]> {
    const where: FindOptionsWhere<Book> = {};
    if (filterDto?.testament) {
      where.testament = filterDto.testament;
    }
    return this.bookRepository.find({
      where,
      order: { order: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new EntityNotFoundError('Book', id);
    }
    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existing = await this.bookRepository.findOneBy({
      abbreviation: createBookDto.abbreviation.toUpperCase(),
    });

    if (existing) {
      throw new EntityConflictError(
        `Ya existe un libro registrado con la abreviación ${createBookDto.abbreviation}.`,
      );
    }

    const book = this.bookRepository.create({
      ...createBookDto,
      abbreviation: createBookDto.abbreviation.toUpperCase(),
    });
    return this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }
}
