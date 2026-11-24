import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { PortfolioProfileService } from '../services/portfolio-profile.service';
import { PortfolioProfile } from '../entities/portfolio-profile.entity';

@Controller('portfolio/profile')
export class PortfolioProfileController {
  constructor(private readonly profileService: PortfolioProfileService) {}

  @Get()
  async getProfile(@Query('lang') lang?: string): Promise<PortfolioProfile> {
    const profile = await this.profileService.findByLanguage(lang);
    if (!profile) {
      throw new NotFoundException('Perfil del portafolio no encontrado.');
    }
    return profile;
  }
}
