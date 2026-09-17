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
    const targetLang = lang?.trim() || 'es';
    const qb = this.placesRepo.createQueryBuilder('place');
    qb.where('place.language = :lang', { lang: targetLang });

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
    qb.orderBy('place.id', 'ASC');
    return qb.getMany();
  }
}
