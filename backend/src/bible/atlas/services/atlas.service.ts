import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricalPlaceEntity } from '../entities/historical-place.entity';

@Injectable()
export class AtlasService {
  constructor(
    @InjectRepository(HistoricalPlaceEntity, 'bibleConnection')
    private readonly placesRepo: Repository<HistoricalPlaceEntity>,
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
}
