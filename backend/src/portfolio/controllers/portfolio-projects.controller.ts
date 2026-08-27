import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  PortfolioProjectsService,
  ParsedPortfolioProject,
} from '../services/portfolio-projects.service';

@Controller('portfolio/projects')
export class PortfolioProjectsController {
  constructor(private readonly projectsService: PortfolioProjectsService) {}

  @Get()
  async getAllProjects(
    @Query('lang') lang?: string,
  ): Promise<ParsedPortfolioProject[]> {
    return this.projectsService.findAll(lang);
  }

  @Get(':slug')
  async getProjectBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ): Promise<ParsedPortfolioProject> {
    const project = await this.projectsService.findBySlug(slug, lang);
    if (!project) {
      throw new NotFoundException(`Proyecto con slug "${slug}" no encontrado.`);
    }
    return project;
  }
}
