import { Controller, Get, Param, Query } from '@nestjs/common';
import { InfrastructureService } from '../services/infrastructure.service';
import { GetInfrastructureQueryDto } from '../dto/get-infrastructure-query.dto';

@Controller('doiceladev/infrastructure')
export class InfrastructureController {
  constructor(private readonly infrastructureService: InfrastructureService) {}

  @Get()
  async findAll(@Query() query: GetInfrastructureQueryDto) {
    return this.infrastructureService.findAll(query);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.infrastructureService.getCategories(lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.infrastructureService.findOne(idOrSlug, lang);
  }
}
