import { Controller, Get, Query } from '@nestjs/common';
import { TimelineService } from '../services/timeline.service';

@Controller('bible')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get(['timeline', 'historical/timeline'])
  async getTimeline(
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('lang') lang?: string,
  ) {
    const fromYearBC = from ? parseInt(from, 10) : undefined;
    const toYearBC = to ? parseInt(to, 10) : undefined;
    return this.timelineService.getTimelineEvents(
      type,
      fromYearBC,
      toYearBC,
      lang,
    );
  }
}
