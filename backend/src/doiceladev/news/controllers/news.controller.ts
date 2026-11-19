import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from '../services/news.service';
import { GetNewsQueryDto } from '../dto/get-news-query.dto';

@Controller('doiceladev/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(@Query() query: GetNewsQueryDto) {
    return this.newsService.findAll(query);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.newsService.getCategories(lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.newsService.findOne(idOrSlug, lang);
  }
}
