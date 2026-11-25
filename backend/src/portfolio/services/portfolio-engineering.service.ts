import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  EngineeringDomainType,
  PortfolioEngineeringPillar,
} from '../entities/portfolio-engineering-pillar.entity';

@Injectable()
export class PortfolioEngineeringService {
  constructor(
    @InjectRepository(PortfolioEngineeringPillar, 'portfolioConnection')
    private readonly engineeringRepository: Repository<PortfolioEngineeringPillar>,
  ) {}

  async findAll(options?: {
    language?: string;
    featured?: boolean;
    domain?: EngineeringDomainType;
  }): Promise<PortfolioEngineeringPillar[]> {
    const lang = options?.language === 'en' ? 'en' : 'es';
    const buildWhere = (
      targetLang: string,
    ): FindOptionsWhere<PortfolioEngineeringPillar> => {
      const where: FindOptionsWhere<PortfolioEngineeringPillar> = {
        language: targetLang,
      };
      if (options?.featured !== undefined) {
        where.featured = options.featured;
      }
      if (options?.domain) {
        where.domain = options.domain;
      }
      return where;
    };

    let items = await this.engineeringRepository.find({
      where: buildWhere(lang),
      order: { orderIndex: 'ASC', id: 'ASC' },
    });

    if (items.length === 0 && lang !== 'es') {
      items = await this.engineeringRepository.find({
        where: buildWhere('es'),
        order: { orderIndex: 'ASC', id: 'ASC' },
      });
    }

    return items;
  }
}
