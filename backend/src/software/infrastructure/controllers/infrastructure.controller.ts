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
import { InfrastructureService } from '../services/infrastructure.service';
import { CreateInfrastructurePostDto } from '../dto/create-infrastructure-post.dto';
import { GetInfrastructureQueryDto } from '../dto/get-infrastructure-query.dto';

@Controller('software/infrastructure')
export class InfrastructureController {
  constructor(private readonly infraService: InfrastructureService) {}

  @Get()
  async findAll(@Query() query: GetInfrastructureQueryDto) {
    return this.infraService.findAll(query);
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
  async like(@Param('id', ParseIntPipe) id: number) {
    return this.infraService.like(id);
  }

  @Post()
  async create(@Body() createDto: CreateInfrastructurePostDto) {
    return this.infraService.create(createDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.infraService.remove(id);
    return { success: true };
  }
}
