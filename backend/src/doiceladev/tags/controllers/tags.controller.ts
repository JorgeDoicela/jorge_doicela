import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagsService } from '../services/tags.service';
import { GetTagArticlesQueryDto } from '../dto/get-tag-articles-query.dto';

@Controller('doiceladev/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags() {
    return this.tagsService.getAllTags();
  }

  @Get(':slug')
  async getArticlesByTag(
    @Param('slug') slug: string,
    @Query() query: GetTagArticlesQueryDto,
  ) {
    return this.tagsService.getArticlesByTag(slug, query);
  }
}
