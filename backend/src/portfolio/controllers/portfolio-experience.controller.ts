import { Controller, Get, Query } from '@nestjs/common';
import { PortfolioExperienceService } from '../services/portfolio-experience.service';
import { PortfolioExperience } from '../entities/portfolio-experience.entity';

@Controller('portfolio/experience')
export class PortfolioExperienceController {
  constructor(private readonly experienceService: PortfolioExperienceService) {}

  @Get()
  async getAllExperience(
    @Query('lang') lang?: string,
    @Query('featured') featured?: string,
    @Query('type') type?: string,
  ): Promise<PortfolioExperience[]> {
    const parsedFeatured =
      featured === 'true' ? true : featured === 'false' ? false : undefined;
    const parsedType =
      type === 'work' || type === 'education' || type === 'certification'
        ? type
        : undefined;

    return this.experienceService.findAll({
      language: lang,
      featured: parsedFeatured,
      type: parsedType,
    });
  }
}
