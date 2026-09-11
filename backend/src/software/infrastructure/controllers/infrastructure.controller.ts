import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { InfrastructureService } from '../services/infrastructure.service';
import { CreateInfrastructurePostDto } from '../dto/create-infrastructure-post.dto';
import type {
  InfrastructureCategory,
  InfrastructureEnvironment,
  InfrastructureDifficulty,
} from '../entities/infrastructure-post.entity';

@Controller('software/infrastructure')
export class InfrastructureController {
  constructor(private readonly infraService: InfrastructureService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('environment') environment?: string,
    @Query('difficulty') difficulty?: string,
    @Query('search') search?: string,
    @Query('lang') lang?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.infraService.findAll(
      category as InfrastructureCategory,
      environment as InfrastructureEnvironment,
      difficulty as InfrastructureDifficulty,
      search,
      lang,
      sortBy as any,
    );
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.infraService.getCategories(lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.infraService.findOne(idOrSlug, lang);
  }

  @Post(':id/like')
  async like(@Param('id') id: string) {
    return this.infraService.like(+id);
  }

  @Post()
  async create(@Body() createDto: CreateInfrastructurePostDto) {
    return this.infraService.create(createDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.infraService.remove(+id);
    return { success: true };
  }
}
