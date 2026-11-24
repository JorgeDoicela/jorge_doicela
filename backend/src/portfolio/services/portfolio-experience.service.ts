import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PortfolioExperience } from '../entities/portfolio-experience.entity';

@Injectable()
export class PortfolioExperienceService {
  constructor(
    @InjectRepository(PortfolioExperience, 'portfolioConnection')
    private readonly experienceRepository: Repository<PortfolioExperience>,
  ) {}

  async findAll(options?: {
    language?: string;
    featured?: boolean;
    type?: 'work' | 'education' | 'certification';
  }): Promise<PortfolioExperience[]> {
    const lang = options?.language === 'en' ? 'en' : 'es';
    const buildWhere = (
      targetLang: string,
    ): FindOptionsWhere<PortfolioExperience> => {
      const where: FindOptionsWhere<PortfolioExperience> = {
        language: targetLang,
      };
      if (options?.featured !== undefined) {
        where.featured = options.featured;
      }
      if (options?.type) {
        where.type = options.type;
      }
      return where;
    };

    let items = await this.experienceRepository.find({
      where: buildWhere(lang),
      order: { orderIndex: 'ASC', id: 'ASC' },
    });

    if (items.length === 0 && lang !== 'es') {
      items = await this.experienceRepository.find({
        where: buildWhere('es'),
        order: { orderIndex: 'ASC', id: 'ASC' },
      });
    }

    return items;
  }
}
