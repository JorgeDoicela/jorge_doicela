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

  async findAll(
    language?: string,
    featured?: boolean,
  ): Promise<PortfolioProject[]> {
    const lang = language === 'en' ? 'en' : 'es';
    const buildWhere = (
      targetLang: string,
    ): FindOptionsWhere<PortfolioProject> => {
      const where: FindOptionsWhere<PortfolioProject> = {
        language: targetLang,
      };
      if (featured !== undefined) {
        where.featured = featured;
      }
      return where;
    };

    let projects = await this.projectRepository.find({
      where: buildWhere(lang),
      order: { orderIndex: 'ASC', createdAt: 'DESC' },
    });
    if (projects.length === 0 && lang !== 'es') {
      projects = await this.projectRepository.find({
        where: buildWhere('es'),
        order: { orderIndex: 'ASC', createdAt: 'DESC' },
      });
    }
    return projects;
  }

  async findBySlug(
    slug: string,
    language?: string,
  ): Promise<PortfolioProject | null> {
    const lang = language === 'en' ? 'en' : 'es';
    let project = await this.projectRepository.findOne({
      where: { slug, language: lang },
    });
    if (!project && lang !== 'es') {
      project = await this.projectRepository.findOne({
        where: { slug, language: 'es' },
      });
    }
    return project;
  }
}
