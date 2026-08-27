import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { CreateAiResourceDto } from '../dto/create-ai-resource.dto';
import type { AiResourceType } from '../entities/ai-resource.entity';

@Controller('software/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('lang') lang?: string,
  ) {
    return this.aiService.findAll(type as AiResourceType, search, lang);
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
  async remove(@Param('id') id: string) {
    await this.aiService.remove(+id);
    return { success: true };
  }
}
