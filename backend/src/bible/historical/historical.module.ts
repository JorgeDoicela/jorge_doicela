import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricalPlaceEntity } from './entities/historical-place.entity';
import { TimelineEventEntity } from './entities/timeline-event.entity';
import { ArchaeologyArticleEntity } from './entities/archaeology-article.entity';
import { HistoricalService } from './services/historical.service';
import { HistoricalController } from './controllers/historical.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [HistoricalPlaceEntity, TimelineEventEntity, ArchaeologyArticleEntity],
      'bibleConnection',
    ),
  ],
  providers: [HistoricalService],
  controllers: [HistoricalController],
  exports: [HistoricalService],
})
export class HistoricalModule {}
