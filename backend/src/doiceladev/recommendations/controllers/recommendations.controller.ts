import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationsService } from '../services/recommendations.service';
import { GetRecommendationsQueryDto } from '../dto/get-recommendations-query.dto';
import { RecommendationCardDto } from '../dto/recommendation-card.dto';

@Controller('doiceladev/recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  async getRecommendations(
    @Query() query: GetRecommendationsQueryDto,
  ): Promise<RecommendationCardDto[]> {
    return this.recommendationsService.getRecommendations(query);
  }
}
