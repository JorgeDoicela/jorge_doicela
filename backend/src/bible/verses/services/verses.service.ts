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
    // 1. Sembrar Traducciones principales
    const translationsData = [
      {
        abbreviation: 'RV1960',
        name: 'Reina-Valera 1960',
        language: 'Español',
      },
      {
        abbreviation: 'NVI',
        name: 'Nueva Versión Internacional',
        language: 'Español',
      },
      {
        abbreviation: 'LBLA',
        name: 'La Biblia de las Américas',
        language: 'Español',
      },
      { abbreviation: 'KJV', name: 'King James Version', language: 'Inglés' },
      { abbreviation: 'JER', name: 'Biblia de Jerusalén', language: 'Español' },
      { abbreviation: 'LXX', name: 'Septuaginta Griega', language: 'Griego' },
      {
        abbreviation: 'BHS',
        name: 'Biblia Hebraica Stuttgartensia (WLC)',
        language: 'Hebreo/Arameo',
      },
    ];

    const translationsMap = new Map<string, Translation>();
    for (const t of translationsData) {
      let found = await this.translationRepository.findOneBy({
        abbreviation: t.abbreviation,
      });
      if (!found) {
        found = await this.translationRepository.save(
          this.translationRepository.create(t),
        );
      }
      translationsMap.set(t.abbreviation, found);
    }

    // 2. Sembrar Libros
    const booksData = [
      { abbreviation: 'GEN', name: 'Génesis', testament: 'OT' as const },
      { abbreviation: 'SAL', name: 'Salmos', testament: 'OT' as const },
      { abbreviation: 'JEREMIAS', name: 'Jeremías', testament: 'OT' as const },
      { abbreviation: 'DAN', name: 'Daniel', testament: 'OT' as const },
      { abbreviation: 'ESD', name: 'Esdras', testament: 'OT' as const },
      { abbreviation: 'JN', name: 'Juan', testament: 'NT' as const },
      { abbreviation: 'ROM', name: 'Romanos', testament: 'NT' as const },
    ];

    const booksMap = new Map<string, Book>();
    for (const b of booksData) {
      let found = await this.bookRepository.findOneBy({
        abbreviation: b.abbreviation,
      });
      if (!found) {
        found = await this.bookRepository.save(this.bookRepository.create(b));
      }
      booksMap.set(b.abbreviation, found);
    }

    // 3. Sembrar Versículos en Múltiples Versiones
    const sampleVerses = [
      // Génesis 1:1
      {
        bookAbbr: 'GEN',
        transAbbr: 'RV1960',
        ch: 1,
        v: 1,
        text: 'En el principio creó Dios los cielos y la tierra.',
      },
      {
        bookAbbr: 'GEN',
        transAbbr: 'NVI',
        ch: 1,
        v: 1,
        text: 'Dios, en el principio, creó los cielos y la tierra.',
      },
      {
        bookAbbr: 'GEN',
        transAbbr: 'LBLA',
        ch: 1,
        v: 1,
        text: 'En el principio creó Dios los cielos y la tierra.',
      },
      {
        bookAbbr: 'GEN',
        transAbbr: 'KJV',
        ch: 1,
        v: 1,
        text: 'In the beginning God created the heaven and the earth.',
      },
      {
        bookAbbr: 'GEN',
        transAbbr: 'JER',
        ch: 1,
        v: 1,
        text: 'En el principio creó Dios los cielos y la tierra.',
      },
      {
        bookAbbr: 'GEN',
        transAbbr: 'LXX',
        ch: 1,
        v: 1,
        text: 'Ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν.',
      },
      {
        bookAbbr: 'GEN',
        transAbbr: 'BHS',
        ch: 1,
        v: 1,
        text: 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃',
      },

      // Génesis 1:2
      {
        bookAbbr: 'GEN',
        transAbbr: 'RV1960',
        ch: 1,
        v: 2,
        text: 'Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.',
      },
      {
        bookAbbr: 'GEN',
        transAbbr: 'BHS',
        ch: 1,
        v: 2,
        text: 'וְהָאָ֗רֶץ הָיְתָ֥ה תֹ֙הוּ֙ וָבֹ֔הוּ וְחֹ֖שֶׁךְ עַל־פְּנֵ֣י תְה֑וֹם וְר֣וּחַ אֱלֹהִ֔ים מְרַחֶ֖פֶת עַל־פְּנֵ֥י הַמָּֽיִם׃',
      },

      // Daniel 2:4 (Porción en Arameo Imperial)
      {
        bookAbbr: 'DAN',
        transAbbr: 'RV1960',
        ch: 2,
        v: 4,
        text: 'Entonces hablaron los caldeos al rey en lengua aramea: Rey, para siempre vive; di el sueño a tus siervos, y te mostraremos la interpretación.',
      },
      {
        bookAbbr: 'DAN',
        transAbbr: 'NVI',
        ch: 2,
        v: 4,
        text: 'Los astrólogos respondieron al rey en lengua aramea: ¡Que viva el rey para siempre! Cuente Su Majestad el sueño a sus siervos, y nosotros se lo interpretaremos.',
      },
      {
        bookAbbr: 'DAN',
        transAbbr: 'BHS',
        ch: 2,
        v: 4,
        text: 'וַיְדַבְּר֧וּ הַכַּשְׂדִּ֛ים לַמַּ֖לְכָּא אֲרָמִ֑ית מַלְכָּא֙ לְעָלְמִ֣ין חֱיִ֔י אֱמַ֥ר חֶלְמָ֛א לְעַבְדַיךְ֙ וּפִשְׁרָ֖א נְחַוֵּֽא׃',
      },

      // Jeremías 10:11 (Versículo en Arameo)
      {
        bookAbbr: 'JEREMIAS',
        transAbbr: 'RV1960',
        ch: 10,
        v: 11,
        text: 'Les diréis así: Los dioses que no hicieron los cielos ni la tierra, perezcan de la tierra y de debajo de estos cielos.',
      },
      {
        bookAbbr: 'JEREMIAS',
        transAbbr: 'BHS',
        ch: 10,
        v: 11,
        text: 'כִּדְנָה֙ תֵּאמְר֣וּן לְה֔וֹם אֱלָ֣הַיָּ֔א דִּֽי־שְׁמַיָּ֥א וְאַרְקָ֖א לָ֣א עֲבַ֑דוּ יֵאבַ֧דוּ מֵֽאַרְעָ֛א וּמִן־תְּח֥וֹת שְׁמַיָּ֖א אֵֽלֶּה׃',
      },

      // Salmos 23:1
      {
        bookAbbr: 'SAL',
        transAbbr: 'RV1960',
        ch: 23,
        v: 1,
        text: 'Jehová es mi pastor; nada me faltará.',
      },
      {
        bookAbbr: 'SAL',
        transAbbr: 'NVI',
        ch: 23,
        v: 1,
        text: 'El Señor es mi pastor, nada me falta.',
      },
      {
        bookAbbr: 'SAL',
        transAbbr: 'LBLA',
        ch: 23,
        v: 1,
        text: 'El Señor es mi pastor, nada me faltará.',
      },
      {
        bookAbbr: 'SAL',
        transAbbr: 'KJV',
        ch: 23,
        v: 1,
        text: 'The LORD is my shepherd; I shall not want.',
      },
      {
        bookAbbr: 'SAL',
        transAbbr: 'JER',
        ch: 23,
        v: 1,
        text: 'Yahveh es mi pastor, nada me falta.',
      },
      {
        bookAbbr: 'SAL',
        transAbbr: 'BHS',
        ch: 23,
        v: 1,
        text: 'מִזְמ֥וֹר לְדָוִ֑ד יְהוָ֥ה רֹ֝עִ֗י לֹ֣א אֶחְסָֽר׃',
      },

      // Juan 1:1
      {
        bookAbbr: 'JN',
        transAbbr: 'RV1960',
        ch: 1,
        v: 1,
        text: 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'NVI',
        ch: 1,
        v: 1,
        text: 'En el principio ya existía el Verbo, y el Verbo estaba con Dios, y el Verbo era Dios.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'LBLA',
        ch: 1,
        v: 1,
        text: 'En el principio existía el Verbo, y el Verbo estaba con Dios, y el Verbo era Dios.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'KJV',
        ch: 1,
        v: 1,
        text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'JER',
        ch: 1,
        v: 1,
        text: 'En el principio existía la Palabra y la Palabra estaba con Dios, y la Palabra era Dios.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'LXX',
        ch: 1,
        v: 1,
        text: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.',
      },

      // Juan 3:16
      {
        bookAbbr: 'JN',
        transAbbr: 'RV1960',
        ch: 3,
        v: 16,
        text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'NVI',
        ch: 3,
        v: 16,
        text: 'Porque tanto amó Dios al mundo que dio a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'LBLA',
        ch: 3,
        v: 16,
        text: 'Porque de tal manera amó Dios al mundo, que dio a su Hijo unigénito, para que todo aquel que cree en Él, no se pierda, mas tenga vida eterna.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'KJV',
        ch: 3,
        v: 16,
        text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'JER',
        ch: 3,
        v: 16,
        text: 'Porque tanto amó Dios al mundo que dio a su Hijo único, para que todo el que crea en él no perezca, sino que tenga vida eterna.',
      },
      {
        bookAbbr: 'JN',
        transAbbr: 'LXX',
        ch: 3,
        v: 16,
        text: 'Οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον, ὥστε τὸν υἱὸν τὸν μονογενῆ ἔδωκεν, ἵνα πᾶς ὁ πιστεύων εἰς αὐτὸν μὴ ἀπόληται ἀλλ’ ἔχῃ ζωὴν αἰώνιον.',
      },
    ];

    for (const v of sampleVerses) {
      const book = booksMap.get(v.bookAbbr);
      const translation = translationsMap.get(v.transAbbr);
      if (book && translation) {
        const exists = await this.verseRepository.findOne({
          where: {
            book: { id: book.id },
            translation: { id: translation.id },
            chapter: v.ch,
            verseNumber: v.v,
          },
        });
        if (!exists) {
          await this.verseRepository.save(
            this.verseRepository.create({
              book,
              translation,
              chapter: v.ch,
              verseNumber: v.v,
              text: v.text,
            }),
          );
        }
      }
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
