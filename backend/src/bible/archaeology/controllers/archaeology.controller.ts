import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ArchaeologyService } from '../services/archaeology.service';
import { GetArticlesQueryDto } from '../dto/get-articles-query.dto';

@Controller('bible')
export class ArchaeologyController {
  constructor(private readonly archaeologyService: ArchaeologyService) {}

  @Get(['archaeology/articles', 'historical/articles'])
  async getArticles(@Query() query: GetArticlesQueryDto) {
    return this.archaeologyService.getArticles(
      query.category,
      query.q,
      query.lang,
    );
  }

  @Get(['archaeology/articles/:slug', 'historical/articles/:slug'])
  async getArticleBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ) {
    const article = await this.archaeologyService.getArticleBySlug(slug, lang);
    if (!article) {
      throw new NotFoundException(`Artículo con slug "${slug}" no encontrado`);
    }
    return article;
  }
}
