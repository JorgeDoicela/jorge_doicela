import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verse } from './verses/entities/verse.entity';
import { Book } from './books/entities/book.entity';
import { Translation } from './translations/entities/translation.entity';
import { VersesModule } from './verses/verses.module';
import { BooksModule } from './books/books.module';
import { TranslationsModule } from './translations/translations.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'bibleConnection',
      type: 'better-sqlite3',
      database: 'bible.sqlite',
      entities: [Verse, Book, Translation],
      synchronize: true,
    }),
    VersesModule,
    BooksModule,
    TranslationsModule,
  ],
})
export class BibleModule {}
