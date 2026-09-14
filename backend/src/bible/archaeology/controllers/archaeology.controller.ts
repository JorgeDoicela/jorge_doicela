import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ArchaeologyService } from '../services/archaeology.service';

@Controller('bible')
export class ArchaeologyController {
  constructor(private readonly archaeologyService: ArchaeologyService) {}

  @Get(['archaeology/articles', 'historical/articles'])
  async getArticles(
    @Query('category') category?: string,
    @Query('q') query?: string,
    @Query('lang') lang?: string,
  ) {
    return this.archaeologyService.getArticles(category, query, lang);
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
