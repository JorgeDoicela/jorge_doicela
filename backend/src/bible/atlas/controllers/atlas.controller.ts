import { Controller, Get, Query } from '@nestjs/common';
import { AtlasService } from '../services/atlas.service';
import { GetPlacesQueryDto } from '../dto/get-places-query.dto';
import { HistoricalPlaceEntity } from '../entities/historical-place.entity';

@Controller('bible/atlas')
export class AtlasController {
  constructor(private readonly atlasService: AtlasService) {}

  @Get('places')
  async getPlaces(
    @Query() query: GetPlacesQueryDto,
  ): Promise<HistoricalPlaceEntity[]> {
    return this.atlasService.getPlaces(query.category, query.q, query.lang);
  }
}
