import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { GetBlogQueryDto } from '../dto/get-blog-query.dto';

@Controller('doiceladev/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(@Query() query: GetBlogQueryDto) {
    return this.blogService.findAll(query);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.blogService.getCategories(lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.blogService.findOne(idOrSlug, lang);
  }
}
