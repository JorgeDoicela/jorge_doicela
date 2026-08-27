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
    @Query('lang') lang?: string,
  ) {
    return this.historicalService.getPlaces(category, query, lang);
  }

  @Get('timeline')
  async getTimeline(
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('lang') lang?: string,
  ) {
    const fromYearBC = from ? parseInt(from, 10) : undefined;
    const toYearBC = to ? parseInt(to, 10) : undefined;
    return this.historicalService.getTimelineEvents(
      type,
      fromYearBC,
      toYearBC,
      lang,
    );
  }

  @Get('articles')
  async getArticles(
    @Query('category') category?: string,
    @Query('q') query?: string,
    @Query('lang') lang?: string,
  ) {
    return this.historicalService.getArticles(category, query, lang);
  }

  @Get('articles/:slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ) {
    const article = await this.historicalService.getArticleBySlug(slug, lang);
    if (!article) {
      throw new NotFoundException(`Artículo con slug "${slug}" no encontrado`);
    }
    return article;
  }
}
