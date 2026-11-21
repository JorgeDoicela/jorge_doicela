import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagsService } from '../services/tags.service';
import { GetTagsQueryDto } from '../dto/get-tags-query.dto';
import { GetTagArticlesQueryDto } from '../dto/get-tag-articles-query.dto';

@Controller('doiceladev/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags(@Query() query: GetTagsQueryDto) {
    return this.tagsService.getAllTags(query);
  }

  @Get(':slug')
  async getArticlesByTag(
    @Param('slug') slug: string,
    @Query() query: GetTagArticlesQueryDto,
  ) {
    return this.tagsService.getArticlesByTag(slug, query);
  }
}
