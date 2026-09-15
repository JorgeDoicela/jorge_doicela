import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verse } from './verses/entities/verse.entity';
import { Book } from './books/entities/book.entity';
import { Translation } from './translations/entities/translation.entity';
import { LexiconEntry } from './morphology/entities/lexicon-entry.entity';
import { MorphologyToken } from './morphology/entities/morphology-token.entity';
import { HistoricalPlaceEntity } from './atlas/entities/historical-place.entity';
import { TimelineEventEntity } from './timeline/entities/timeline-event.entity';
import { ArchaeologyArticleEntity } from './archaeology/entities/archaeology-article.entity';
import { EvangelismPathwayEntity } from './evangelism/entities/evangelism-pathway.entity';
import { EvangelismObjectionEntity } from './evangelism/entities/evangelism-objection.entity';
import { EvangelismTractEntity } from './evangelism/entities/evangelism-tract.entity';
import { VersesModule } from './verses/verses.module';
import { BooksModule } from './books/books.module';
import { TranslationsModule } from './translations/translations.module';
import { MorphologyModule } from './morphology/morphology.module';
import { AtlasModule } from './atlas/atlas.module';
import { TimelineModule } from './timeline/timeline.module';
import { ArchaeologyModule } from './archaeology/archaeology.module';
import { EvangelismModule } from './evangelism/evangelism.module';
import type Database from 'better-sqlite3';
import { resolveDatabasePath } from '../common/database/database-path.util';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'bibleConnection',
      type: 'better-sqlite3',
      database: resolveDatabasePath('DATABASE_BIBLE_PATH', 'bible.sqlite'),
      enableWAL: true,
      prepareDatabase: (db: Database.Database) => {
        db.pragma('foreign_keys = ON');
        db.pragma('synchronous = NORMAL');
        db.pragma('busy_timeout = 5000');
        db.pragma('cache_size = -32000'); // 32 MB de caché en RAM para optimizar consultas de versículos y léxicos
        db.pragma('journal_size_limit = 67108864'); // 64 MB límite de WAL para proteger disco en VPS de 1 GB RAM
        db.pragma('temp_store = MEMORY'); // Tablas y ordenamientos temporales en RAM
      },
      entities: [
        Verse,
        Book,
        Translation,
        LexiconEntry,
        MorphologyToken,
        HistoricalPlaceEntity,
        TimelineEventEntity,
        ArchaeologyArticleEntity,
        EvangelismPathwayEntity,
        EvangelismObjectionEntity,
        EvangelismTractEntity,
      ],
      synchronize: true,
    }),
    VersesModule,
    BooksModule,
    TranslationsModule,
    MorphologyModule,
    AtlasModule,
    TimelineModule,
    ArchaeologyModule,
    EvangelismModule,
  ],
})
export class BibleModule {}
