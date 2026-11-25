import { Controller, Get, Query } from '@nestjs/common';
import { PortfolioEngineeringService } from '../services/portfolio-engineering.service';
import {
  EngineeringDomainType,
  PortfolioEngineeringPillar,
} from '../entities/portfolio-engineering-pillar.entity';

const VALID_DOMAINS: readonly EngineeringDomainType[] = [
  'cloud',
  'security',
  'systems',
  'ai',
];

@Controller('portfolio/engineering')
export class PortfolioEngineeringController {
  constructor(
    private readonly engineeringService: PortfolioEngineeringService,
  ) {}

  @Get()
  async getAllPillars(
    @Query('lang') lang?: string,
    @Query('featured') featured?: string,
    @Query('domain') domain?: string,
  ): Promise<PortfolioEngineeringPillar[]> {
    const parsedFeatured =
      featured === 'true' ? true : featured === 'false' ? false : undefined;
    const parsedDomain = VALID_DOMAINS.includes(domain as EngineeringDomainType)
      ? (domain as EngineeringDomainType)
      : undefined;

    return this.engineeringService.findAll({
      language: lang,
      featured: parsedFeatured,
      domain: parsedDomain,
    });
  }
}
