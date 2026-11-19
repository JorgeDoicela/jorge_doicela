import { Controller, Get, Param, Query } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { GetAiResourcesQueryDto } from '../dto/get-ai-resources-query.dto';

@Controller('doiceladev/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get()
  async findAll(@Query() query: GetAiResourcesQueryDto) {
    return this.aiService.findAll(query);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.aiService.getCategories(lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.aiService.findOne(idOrSlug, lang);
  }
}
