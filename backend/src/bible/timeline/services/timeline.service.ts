import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimelineEventEntity } from '../entities/timeline-event.entity';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(TimelineEventEntity, 'bibleConnection')
    private readonly timelineRepo: Repository<TimelineEventEntity>,
  ) {}

  async getTimelineEvents(
    type?: string,
    fromYearBC?: number,
    toYearBC?: number,
    lang?: string,
  ): Promise<TimelineEventEntity[]> {
    const qb = this.timelineRepo.createQueryBuilder('event');
    if (lang) {
      qb.andWhere('event.language = :lang', { lang });
    }
    if (type && type !== 'all') {
      qb.andWhere('event.type = :type', { type });
    }
    if (fromYearBC !== undefined && toYearBC !== undefined) {
      qb.andWhere(
        'event.startYearBC >= :toYearBC AND event.endYearBC <= :fromYearBC',
        {
          fromYearBC,
          toYearBC,
        },
      );
    }
    qb.orderBy('event.startYearBC', 'DESC');
    return qb.getMany();
  }
}
