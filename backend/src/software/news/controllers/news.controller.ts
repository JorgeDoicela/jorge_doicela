import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NewsService } from '../services/news.service';
import { CreateNewsDto } from '../dto/create-news.dto';

@Controller('software/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(@Query('search') search?: string, @Query('tag') tag?: string) {
    return this.newsService.findAll(search, tag);
  }

  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.newsService.findOne(idOrSlug);
  }

  @Post()
  async create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.newsService.remove(+id);
    return { success: true };
  }
}
