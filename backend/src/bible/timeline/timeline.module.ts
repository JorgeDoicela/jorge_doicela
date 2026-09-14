import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelineEventEntity } from './entities/timeline-event.entity';
import { TimelineService } from './services/timeline.service';
import { TimelineController } from './controllers/timeline.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimelineEventEntity], 'bibleConnection')],
  providers: [TimelineService],
  controllers: [TimelineController],
  exports: [TimelineService],
})
export class TimelineModule {}
