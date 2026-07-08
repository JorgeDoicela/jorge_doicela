import { Injectable, OnModuleInit } from '@nestjs/common';
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

@Injectable()
export class VersesService implements OnModuleInit {
  constructor(
    @InjectRepository(Verse, 'bibleConnection')
    private readonly verseRepository: Repository<Verse>,
    @InjectRepository(Book, 'bibleConnection')
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Translation, 'bibleConnection')
    private readonly translationRepository: Repository<Translation>,
    private readonly booksService: BooksService,
    private readonly translationsService: TranslationsService,
  ) {}

  async onModuleInit() {
    const totalVerses = await this.verseRepository.count();
    if (totalVerses === 0) {
      // 1. Sembrar Traducción
      let translation = await this.translationRepository.findOneBy({
        abbreviation: 'RV1960',
      });
      if (!translation) {
        translation = this.translationRepository.create({
          name: 'Reina-Valera 1960',
          abbreviation: 'RV1960',
          language: 'Español',
        });
        translation = await this.translationRepository.save(translation);
      }

      // 2. Sembrar Libros
      let genesis = await this.bookRepository.findOneBy({
        abbreviation: 'GEN',
      });
      if (!genesis) {
        genesis = this.bookRepository.create({
          name: 'Génesis',
          abbreviation: 'GEN',
          testament: 'OT',
        });
        genesis = await this.bookRepository.save(genesis);
      }

      let juan = await this.bookRepository.findOneBy({ abbreviation: 'JN' });
      if (!juan) {
        juan = this.bookRepository.create({
          name: 'Juan',
          abbreviation: 'JN',
          testament: 'NT',
        });
        juan = await this.bookRepository.save(juan);
      }

      let salmos = await this.bookRepository.findOneBy({ abbreviation: 'SAL' });
      if (!salmos) {
        salmos = this.bookRepository.create({
          name: 'Salmos',
          abbreviation: 'SAL',
          testament: 'OT',
        });
        salmos = await this.bookRepository.save(salmos);
      }

      // 3. Sembrar Versículos
      await this.verseRepository.save([
        {
          book: genesis,
          translation: translation,
          chapter: 1,
          verseNumber: 1,
          text: 'En el principio creó Dios los cielos y la tierra.',
        },
        {
          book: juan,
          translation: translation,
          chapter: 3,
          verseNumber: 16,
          text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
        },
        {
          book: salmos,
          translation: translation,
          chapter: 23,
          verseNumber: 1,
          text: 'Jehová es mi pastor; nada me faltará.',
        },
      ]);
    }
  }

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
      limit = 20,
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

    query.skip(offset).take(limit);
    return query.getMany();
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
