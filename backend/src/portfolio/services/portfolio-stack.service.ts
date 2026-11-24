import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  PortfolioStackItem,
  StackCategoryType,
} from '../entities/portfolio-stack-item.entity';

@Injectable()
export class PortfolioStackService {
  constructor(
    @InjectRepository(PortfolioStackItem, 'portfolioConnection')
    private readonly stackRepository: Repository<PortfolioStackItem>,
  ) {}

  async findAll(options?: {
    language?: string;
    featured?: boolean;
    category?: StackCategoryType;
  }): Promise<PortfolioStackItem[]> {
    const lang = options?.language === 'en' ? 'en' : 'es';
    const buildWhere = (
      targetLang: string,
    ): FindOptionsWhere<PortfolioStackItem> => {
      const where: FindOptionsWhere<PortfolioStackItem> = {
        language: targetLang,
      };
      if (options?.featured !== undefined) {
        where.featured = options.featured;
      }
      if (options?.category) {
        where.category = options.category;
      }
      return where;
    };

    let items = await this.stackRepository.find({
      where: buildWhere(lang),
      order: { orderIndex: 'ASC', id: 'ASC' },
    });

    if (items.length === 0 && lang !== 'es') {
      items = await this.stackRepository.find({
        where: buildWhere('es'),
        order: { orderIndex: 'ASC', id: 'ASC' },
      });
    }

    return items;
  }
}
