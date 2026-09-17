import { Controller, Get, Query } from '@nestjs/common';
import { TimelineService } from '../services/timeline.service';
import { GetTimelineQueryDto } from '../dto/get-timeline-query.dto';
import { TimelineEventEntity } from '../entities/timeline-event.entity';

@Controller('bible/timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  async getTimeline(
    @Query() query: GetTimelineQueryDto,
  ): Promise<TimelineEventEntity[]> {
    return this.timelineService.getTimelineEvents(
      query.type,
      query.from,
      query.to,
      query.lang,
    );
  }
}
