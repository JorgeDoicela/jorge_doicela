import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { GetProjectsQueryDto } from '../dto/get-projects-query.dto';

@Controller('doiceladev/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Query() query: GetProjectsQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.projectsService.getCategories(lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.projectsService.findOne(idOrSlug, lang);
  }
}
