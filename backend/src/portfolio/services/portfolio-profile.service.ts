import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioProfile } from '../entities/portfolio-profile.entity';

@Injectable()
export class PortfolioProfileService {
  constructor(
    @InjectRepository(PortfolioProfile, 'portfolioConnection')
    private readonly profileRepository: Repository<PortfolioProfile>,
  ) {}

  async findByLanguage(language?: string): Promise<PortfolioProfile | null> {
    const lang = language === 'en' ? 'en' : 'es';
    let profile = await this.profileRepository.findOne({
      where: { language: lang },
    });
    if (!profile && lang !== 'es') {
      profile = await this.profileRepository.findOne({
        where: { language: 'es' },
      });
    }
    return profile;
  }
}
