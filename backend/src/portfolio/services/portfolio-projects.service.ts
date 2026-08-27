import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PortfolioProject } from '../entities/portfolio-project.entity';

export interface ParsedPortfolioProject extends Omit<
  PortfolioProject,
  'technologies'
> {
  technologies: string[];
}

@Injectable()
export class PortfolioProjectsService {
  constructor(
    @InjectRepository(PortfolioProject, 'portfolioConnection')
    private readonly projectRepository: Repository<PortfolioProject>,
  ) {}

  private parseProject(project: PortfolioProject): ParsedPortfolioProject {
    let parsedTech: string[] = [];
    if (typeof project.technologies === 'string') {
      try {
        if (project.technologies.trim().startsWith('[')) {
          const parsed = JSON.parse(project.technologies) as unknown;
          if (Array.isArray(parsed)) {
            parsedTech = parsed.map((t) => String(t));
          }
        } else {
          parsedTech = project.technologies.split(',').map((t) => t.trim());
        }
      } catch {
        parsedTech = project.technologies.split(',').map((t) => t.trim());
      }
    } else if (Array.isArray(project.technologies)) {
      parsedTech = project.technologies as string[];
    }
    return {
      ...project,
      technologies: parsedTech,
    };
  }

  async findAll(language?: string): Promise<ParsedPortfolioProject[]> {
    const lang = language === 'en' ? 'en' : 'es';
    const projects = await this.projectRepository.find({
      where: { language: lang },
      order: { orderIndex: 'ASC', createdAt: 'DESC' },
    });
    return projects.map((p) => this.parseProject(p));
  }

  async findBySlug(
    slug: string,
    language?: string,
  ): Promise<ParsedPortfolioProject | null> {
    const where: FindOptionsWhere<PortfolioProject> = { slug };
    if (language) {
      where.language = language;
    }
    const project = await this.projectRepository.findOne({ where });
    return project ? this.parseProject(project) : null;
  }
}
