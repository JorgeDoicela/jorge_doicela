import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { HistoricalService } from '../services/historical.service';

@Controller('bible/historical')
export class HistoricalController {
  constructor(private readonly historicalService: HistoricalService) {}

  @Get('atlas/places')
  async getPlaces(
    @Query('category') category?: string,
    @Query('q') query?: string,
  ) {
    return this.historicalService.getPlaces(category, query);
  }

  @Get('timeline')
  async getTimeline(
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromYearBC = from ? parseInt(from, 10) : undefined;
    const toYearBC = to ? parseInt(to, 10) : undefined;
    return this.historicalService.getTimelineEvents(type, fromYearBC, toYearBC);
  }

  @Get('articles')
  async getArticles(
    @Query('category') category?: string,
    @Query('q') query?: string,
  ) {
    return this.historicalService.getArticles(category, query);
  }

  @Get('articles/:slug')
  async getArticleBySlug(@Param('slug') slug: string) {
    const article = await this.historicalService.getArticleBySlug(slug);
    if (!article) {
      throw new NotFoundException(`Artículo con slug "${slug}" no encontrado`);
    }
    return article;
  }
}
