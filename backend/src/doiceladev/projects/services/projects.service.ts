import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectCategory } from '../entities/project.entity';
import { GetProjectsQueryDto } from '../dto/get-projects-query.dto';
import {
  aggregateModuleCategories,
  CategoryCountOption,
} from '../../common/utils/category-aggregation.util';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project, 'doiceladevConnection')
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(query: GetProjectsQueryDto = {}): Promise<Project[]> {
    const { status, category, tag, search, lang, sortBy = 'smart' } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.projectRepository.createQueryBuilder('proj');

    if (lang) {
      qb.andWhere('proj.language = :lang', { lang });
    }

    if (status && status !== 'all') {
      qb.andWhere('proj.status = :status', { status });
    }

    if (category && category !== 'all') {
      qb.andWhere('proj.category = :category', { category });
    }

    if (tag && tag !== 'all') {
      qb.andWhere('proj.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (search) {
      qb.andWhere(
        '(proj.title LIKE :search OR proj.excerpt LIKE :search OR proj.techStack LIKE :search OR proj.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy === 'recent') {
      qb.orderBy('proj.publishedAt', 'DESC');
      qb.addOrderBy('proj.id', 'DESC');
    } else if (sortBy === 'popular') {
      qb.orderBy('proj.views', 'DESC');
      qb.addOrderBy('proj.stars', 'DESC');
      qb.addOrderBy('proj.id', 'DESC');
    } else {
      qb.addSelect(
        '((proj.featured * 1000) + (proj.orderPriority * 20) + (proj.stars * 10) + (proj.likes * 4) + (proj.views * 1.5))',
        'smart_score',
      );
      qb.orderBy('smart_score', 'DESC');
      qb.addOrderBy('proj.publishedAt', 'DESC');
      qb.addOrderBy('proj.id', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll({ ...query, lang: 'es' });
    }

    return results;
  }

  async findOne(idOrSlug: string, lang?: string): Promise<Project> {
    const isId = !isNaN(Number(idOrSlug));
    let project: Project | null = null;

    if (isId) {
      project = await this.projectRepository.findOne({
        where: { id: Number(idOrSlug) },
      });
    } else {
      if (lang) {
        project = await this.projectRepository.findOne({
          where: { slug: idOrSlug, language: lang },
        });
      }
      if (!project) {
        project = await this.projectRepository.findOne({
          where: { slug: idOrSlug },
        });
      }
    }

    if (!project) {
      throw new NotFoundException(`Proyecto "${idOrSlug}" no encontrado`);
    }

    void this.projectRepository.increment({ id: project.id }, 'views', 1);
    project.views += 1;
    return project;
  }

  async getCategories(lang: string = 'es'): Promise<CategoryCountOption[]> {
    const categoryOrder: ProjectCategory[] = [
      'web',
      'backend',
      'devops',
      'tool',
      'open_source',
      'ai',
      'mobile',
    ];
    return aggregateModuleCategories(
      this.projectRepository.createQueryBuilder('proj'),
      'proj',
      lang,
      categoryOrder,
    );
  }
}
