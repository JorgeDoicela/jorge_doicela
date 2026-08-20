import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verse } from '../entities/verse.entity';
import { Book } from '../../books/entities/book.entity';
import { Translation } from '../../translations/entities/translation.entity';
import { CreateVerseDto } from '../dto/create-verse.dto';
import { UpdateVerseDto } from '../dto/update-verse.dto';
import { GetVersesFilterDto } from '../dto/get-verses-filter.dto';
import {
  EntityNotFoundError,
  EntityConflictError,
} from '../../../common/domain/domain-errors';
import { BooksService } from '../../books/services/books.service';
import { TranslationsService } from '../../translations/services/translations.service';
import { ApiBibleService } from './api-bible.service';

@Injectable()
export class VersesService {
  constructor(
    @InjectRepository(Verse, 'bibleConnection')
    private readonly verseRepository: Repository<Verse>,
    @InjectRepository(Book, 'bibleConnection')
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Translation, 'bibleConnection')
    private readonly translationRepository: Repository<Translation>,
    private readonly booksService: BooksService,
    private readonly translationsService: TranslationsService,
    private readonly apiBibleService: ApiBibleService,
  ) {}

  async findAll(): Promise<Verse[]> {
    return this.verseRepository.find({
      relations: {
        book: true,
        translation: true,
      },
    });
  }

  async findFiltered(filterDto: GetVersesFilterDto): Promise<Verse[]> {
    const {
      bookId,
      translationId,
      chapter,
      limit = 200,
      offset = 0,
    } = filterDto;
    const query = this.verseRepository
      .createQueryBuilder('verse')
      .leftJoinAndSelect('verse.book', 'book')
      .leftJoinAndSelect('verse.translation', 'translation');

    if (bookId !== undefined) {
      query.andWhere('book.id = :bookId', { bookId });
    }
    if (translationId !== undefined) {
      query.andWhere('translation.id = :translationId', { translationId });
    }
    if (chapter !== undefined) {
      query.andWhere('verse.chapter = :chapter', { chapter });
    }

    query
      .orderBy('verse.chapter', 'ASC')
      .addOrderBy('verse.verseNumber', 'ASC');

    query.skip(offset).take(limit);
    const existing = await query.getMany();

    if (existing.length > 0 || !bookId || !translationId || !chapter) {
      return existing;
    }

    // Si no está en SQLite pero la API está configurada, consultar API.Bible bajo demanda
    if (this.apiBibleService.isConfigured()) {
      const book = await this.bookRepository.findOne({ where: { id: bookId } });
      const translation = await this.translationRepository.findOne({
        where: { id: translationId },
      });

      if (book && translation) {
        const remoteVerses = await this.apiBibleService.fetchChapterVerses(
          translation.abbreviation,
          book.abbreviation,
          chapter,
        );

        if (remoteVerses && remoteVerses.length > 0) {
          const entitiesToInsert = remoteVerses.map((v) =>
            this.verseRepository.create({
              book,
              translation,
              chapter,
              verseNumber: v.verseNumber,
              text: v.text,
            }),
          );

          try {
            await this.verseRepository.save(entitiesToInsert);
          } catch {
            // Si hubo concurrencia, ignorar error de duplicado
          }

          return entitiesToInsert;
        }
      }
    }

    return existing;
  }

  async findOne(id: number): Promise<Verse> {
    const verse = await this.verseRepository.findOne({
      where: { id },
      relations: {
        book: true,
        translation: true,
      },
    });
    if (!verse) {
      throw new EntityNotFoundError('Verse', id);
    }
    return verse;
  }

  async create(createVerseDto: CreateVerseDto): Promise<Verse> {
    const book = await this.booksService.findOne(createVerseDto.bookId);
    const translation = await this.translationsService.findOne(
      createVerseDto.translationId,
    );

    const existing = await this.verseRepository.findOne({
      where: {
        translation: { id: translation.id },
        book: { id: book.id },
        chapter: createVerseDto.chapter,
        verseNumber: createVerseDto.verseNumber,
      },
    });

    if (existing) {
      throw new EntityConflictError(
        `Ya existe un versículo registrado en la versión ${translation.abbreviation} para ${book.name} ${createVerseDto.chapter}:${createVerseDto.verseNumber}.`,
      );
    }

    const verse = this.verseRepository.create({
      book,
      translation,
      chapter: createVerseDto.chapter,
      verseNumber: createVerseDto.verseNumber,
      text: createVerseDto.text,
    });
    return this.verseRepository.save(verse);
  }

  async update(id: number, updateVerseDto: UpdateVerseDto): Promise<Verse> {
    const verse = await this.findOne(id);

    let book = verse.book;
    let translation = verse.translation;

    if (updateVerseDto.bookId !== undefined) {
      book = await this.booksService.findOne(updateVerseDto.bookId);
    }
    if (updateVerseDto.translationId !== undefined) {
      translation = await this.translationsService.findOne(
        updateVerseDto.translationId,
      );
    }

    if (
      updateVerseDto.bookId !== undefined ||
      updateVerseDto.translationId !== undefined ||
      updateVerseDto.chapter !== undefined ||
      updateVerseDto.verseNumber !== undefined
    ) {
      const checkChapter = updateVerseDto.chapter ?? verse.chapter;
      const checkVerseNumber = updateVerseDto.verseNumber ?? verse.verseNumber;

      const existing = await this.verseRepository.findOne({
        where: {
          translation: { id: translation.id },
          book: { id: book.id },
          chapter: checkChapter,
          verseNumber: checkVerseNumber,
        },
      });

      if (existing && existing.id !== id) {
        throw new EntityConflictError(
          `Ya existe un versículo registrado en ${translation.abbreviation} para ${book.name} ${checkChapter}:${checkVerseNumber}.`,
        );
      }
    }

    verse.book = book;
    verse.translation = translation;
    if (updateVerseDto.chapter !== undefined)
      verse.chapter = updateVerseDto.chapter;
    if (updateVerseDto.verseNumber !== undefined)
      verse.verseNumber = updateVerseDto.verseNumber;
    if (updateVerseDto.text !== undefined) verse.text = updateVerseDto.text;

    return this.verseRepository.save(verse);
  }

  async remove(id: number): Promise<void> {
    const verse = await this.findOne(id);
    await this.verseRepository.remove(verse);
  }
}
