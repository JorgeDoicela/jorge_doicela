import { Controller, Get, Query } from '@nestjs/common';
import { AtlasService } from '../services/atlas.service';
import { GetPlacesQueryDto } from '../dto/get-places-query.dto';

@Controller('bible')
export class AtlasController {
  constructor(private readonly atlasService: AtlasService) {}

  @Get('atlas/places')
  async getPlaces(@Query() query: GetPlacesQueryDto) {
    return this.atlasService.getPlaces(query.category, query.q, query.lang);
  }
}
