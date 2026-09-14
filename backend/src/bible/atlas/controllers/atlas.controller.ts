import { Controller, Get, Query } from '@nestjs/common';
import { AtlasService } from '../services/atlas.service';

@Controller('bible')
export class AtlasController {
  constructor(private readonly atlasService: AtlasService) {}

  @Get(['atlas/places', 'historical/atlas/places'])
  async getPlaces(
    @Query('category') category?: string,
    @Query('q') query?: string,
    @Query('lang') lang?: string,
  ) {
    return this.atlasService.getPlaces(category, query, lang);
  }
}
