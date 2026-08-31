import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verse } from './verses/entities/verse.entity';
import { Book } from './books/entities/book.entity';
import { Translation } from './translations/entities/translation.entity';
import { LexiconEntry } from './morphology/entities/lexicon-entry.entity';
import { MorphologyToken } from './morphology/entities/morphology-token.entity';
import { HistoricalPlaceEntity } from './historical/entities/historical-place.entity';
import { TimelineEventEntity } from './historical/entities/timeline-event.entity';
import { ArchaeologyArticleEntity } from './historical/entities/archaeology-article.entity';
import { VersesModule } from './verses/verses.module';
import { BooksModule } from './books/books.module';
import { TranslationsModule } from './translations/translations.module';
import { MorphologyModule } from './morphology/morphology.module';
import { HistoricalModule } from './historical/historical.module';
import { resolveDatabasePath } from '../common/database/database-path.util';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'bibleConnection',
      type: 'better-sqlite3',
      database: resolveDatabasePath('DATABASE_BIBLE_PATH', 'bible.sqlite'),
      entities: [
        Verse,
        Book,
        Translation,
        LexiconEntry,
        MorphologyToken,
        HistoricalPlaceEntity,
        TimelineEventEntity,
        ArchaeologyArticleEntity,
      ],
      synchronize: true,
    }),
    VersesModule,
    BooksModule,
    TranslationsModule,
    MorphologyModule,
    HistoricalModule,
  ],
})
export class BibleModule {}
