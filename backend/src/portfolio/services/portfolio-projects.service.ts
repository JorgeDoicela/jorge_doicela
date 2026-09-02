import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PortfolioProject } from '../entities/portfolio-project.entity';

@Injectable()
export class PortfolioProjectsService {
  constructor(
    @InjectRepository(PortfolioProject, 'portfolioConnection')
    private readonly projectRepository: Repository<PortfolioProject>,
  ) {}

  async findAll(language?: string): Promise<PortfolioProject[]> {
    const lang = language === 'en' ? 'en' : 'es';
    let projects = await this.projectRepository.find({
      where: { language: lang },
      order: { orderIndex: 'ASC', createdAt: 'DESC' },
    });
    if (projects.length === 0 && lang !== 'es') {
      projects = await this.projectRepository.find({
        where: { language: 'es' },
        order: { orderIndex: 'ASC', createdAt: 'DESC' },
      });
    }
    return projects;
  }

  async findBySlug(
    slug: string,
    language?: string,
  ): Promise<PortfolioProject | null> {
    const where: FindOptionsWhere<PortfolioProject> = { slug };
    if (language) {
      where.language = language;
    }
    let project = await this.projectRepository.findOne({ where });
    if (!project && language) {
      project = await this.projectRepository.findOne({ where: { slug } });
    }
    return project;
  }
}
