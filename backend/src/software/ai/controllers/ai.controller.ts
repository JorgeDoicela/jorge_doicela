import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { CreateAiResourceDto } from '../dto/create-ai-resource.dto';
import { GetAiResourcesQueryDto } from '../dto/get-ai-resources-query.dto';

@Controller('software/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get()
  async findAll(@Query() query: GetAiResourcesQueryDto) {
    return this.aiService.findAll(query);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.aiService.findOne(idOrSlug, lang);
  }

  @Post()
  async create(@Body() createAiResourceDto: CreateAiResourceDto) {
    return this.aiService.create(createAiResourceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.aiService.remove(id);
    return { success: true };
  }
}
