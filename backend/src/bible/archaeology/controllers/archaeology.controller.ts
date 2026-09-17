import { Controller, Get, Query, Param } from '@nestjs/common';
import { ArchaeologyService } from '../services/archaeology.service';
import { GetArticlesQueryDto } from '../dto/get-articles-query.dto';
import { ArchaeologyArticleEntity } from '../entities/archaeology-article.entity';

@Controller('bible/archaeology')
export class ArchaeologyController {
  constructor(private readonly archaeologyService: ArchaeologyService) {}

  @Get('articles')
  async getArticles(
    @Query() query: GetArticlesQueryDto,
  ): Promise<ArchaeologyArticleEntity[]> {
    return this.archaeologyService.getArticles(
      query.category,
      query.q,
      query.lang,
    );
  }

  @Get('articles/:slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ): Promise<ArchaeologyArticleEntity> {
    return this.archaeologyService.getArticleBySlug(slug, lang);
  }
}
