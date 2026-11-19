import { Controller, Get, Param, Query } from '@nestjs/common';
import { TutorialsService } from '../services/tutorials.service';
import { GetTutorialsQueryDto } from '../dto/get-tutorials-query.dto';

@Controller('doiceladev/tutorials')
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Get()
  async findAll(@Query() query: GetTutorialsQueryDto) {
    return this.tutorialsService.findAll(query);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.tutorialsService.getCategories(lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.tutorialsService.findOne(idOrSlug, lang);
  }
}
