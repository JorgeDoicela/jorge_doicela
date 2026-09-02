import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PortfolioProjectsService } from '../services/portfolio-projects.service';
import { PortfolioProject } from '../entities/portfolio-project.entity';

@Controller('portfolio/projects')
export class PortfolioProjectsController {
  constructor(private readonly projectsService: PortfolioProjectsService) {}

  @Get()
  async getAllProjects(
    @Query('lang') lang?: string,
  ): Promise<PortfolioProject[]> {
    return this.projectsService.findAll(lang);
  }

  @Get(':slug')
  async getProjectBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ): Promise<PortfolioProject> {
    const project = await this.projectsService.findBySlug(slug, lang);
    if (!project) {
      throw new NotFoundException(`Proyecto con slug "${slug}" no encontrado.`);
    }
    return project;
  }
}
