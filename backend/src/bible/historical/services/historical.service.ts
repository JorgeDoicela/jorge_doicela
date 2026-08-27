import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { HistoricalPlaceEntity } from '../entities/historical-place.entity';
import { TimelineEventEntity } from '../entities/timeline-event.entity';
import { ArchaeologyArticleEntity } from '../entities/archaeology-article.entity';

@Injectable()
export class HistoricalService {
  constructor(
    @InjectRepository(HistoricalPlaceEntity, 'bibleConnection')
    private readonly placesRepo: Repository<HistoricalPlaceEntity>,
    @InjectRepository(TimelineEventEntity, 'bibleConnection')
    private readonly timelineRepo: Repository<TimelineEventEntity>,
    @InjectRepository(ArchaeologyArticleEntity, 'bibleConnection')
    private readonly articlesRepo: Repository<ArchaeologyArticleEntity>,
  ) {}

  async getPlaces(
    category?: string,
    query?: string,
    lang?: string,
  ): Promise<HistoricalPlaceEntity[]> {
    const qb = this.placesRepo.createQueryBuilder('place');
    if (lang) {
      qb.andWhere('place.language = :lang', { lang });
    }
    if (category && category !== 'all') {
      qb.andWhere('place.category = :category', { category });
    }
    if (query && query.trim()) {
      qb.andWhere(
        '(place.name LIKE :q OR place.description LIKE :q OR place.modernName LIKE :q)',
        {
          q: `%${query.trim()}%`,
        },
      );
    }
    return qb.getMany();
  }

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

  async getArticles(
    category?: string,
    query?: string,
    lang?: string,
  ): Promise<ArchaeologyArticleEntity[]> {
    const qb = this.articlesRepo.createQueryBuilder('article');
    if (lang) {
      qb.andWhere('article.language = :lang', { lang });
    }
    if (category && category !== 'all') {
      qb.andWhere('article.category = :category', { category });
    }
    if (query && query.trim()) {
      qb.andWhere('(article.title LIKE :q OR article.summary LIKE :q)', {
        q: `%${query.trim()}%`,
      });
    }
    qb.orderBy('article.publishDate', 'DESC');
    return qb.getMany();
  }

  async getArticleBySlug(
    slug: string,
    lang?: string,
  ): Promise<ArchaeologyArticleEntity | null> {
    const where: FindOptionsWhere<ArchaeologyArticleEntity> = { slug };
    if (lang) {
      where.language = lang;
    }
    return this.articlesRepo.findOne({ where });
  }
}
