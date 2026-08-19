import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verse } from './verses/entities/verse.entity';
import { Book } from './books/entities/book.entity';
import { Translation } from './translations/entities/translation.entity';
import { LexiconEntry } from './morphology/entities/lexicon-entry.entity';
import { MorphologyToken } from './morphology/entities/morphology-token.entity';
import { VersesModule } from './verses/verses.module';
import { BooksModule } from './books/books.module';
import { TranslationsModule } from './translations/translations.module';
import { MorphologyModule } from './morphology/morphology.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'bibleConnection',
      type: 'better-sqlite3',
      database: process.env.DATABASE_BIBLE_PATH || 'bible.sqlite',
      entities: [Verse, Book, Translation, LexiconEntry, MorphologyToken],
      synchronize: true,
    }),
    VersesModule,
    BooksModule,
    TranslationsModule,
    MorphologyModule,
  ],
})
export class BibleModule {}
