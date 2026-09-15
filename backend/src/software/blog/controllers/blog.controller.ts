import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogPostDto } from '../dto/create-blog-post.dto';
import { GetBlogQueryDto } from '../dto/get-blog-query.dto';

@Controller('software/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(@Query() query: GetBlogQueryDto) {
    return this.blogService.findAll(query.search, query.series, query.lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.blogService.findOne(idOrSlug, lang);
  }

  @Post()
  async create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.blogService.remove(+id);
    return { success: true };
  }
}
