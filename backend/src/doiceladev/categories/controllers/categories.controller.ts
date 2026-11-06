import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { GetCategoriesQueryDto } from '../dto/get-categories-query.dto';
import { GetCategoryArticlesQueryDto } from '../dto/get-category-articles-query.dto';

@Controller('doiceladev/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(@Query() query: GetCategoriesQueryDto) {
    return this.categoriesService.getAllCategories(query);
  }

  @Get(':slug')
  async getArticlesByCategory(
    @Param('slug') slug: string,
    @Query() query: GetCategoryArticlesQueryDto,
  ) {
    return this.categoriesService.getArticlesByCategory(slug, query);
  }
}
