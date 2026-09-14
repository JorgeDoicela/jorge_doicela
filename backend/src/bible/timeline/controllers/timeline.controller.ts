import { Controller, Get, Query } from '@nestjs/common';
import { TimelineService } from '../services/timeline.service';
import { GetTimelineQueryDto } from '../dto/get-timeline-query.dto';

@Controller('bible')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get(['timeline', 'historical/timeline'])
  async getTimeline(@Query() query: GetTimelineQueryDto) {
    return this.timelineService.getTimelineEvents(
      query.type,
      query.from,
      query.to,
      query.lang,
    );
  }
}
