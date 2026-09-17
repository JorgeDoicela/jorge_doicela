import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { GetProjectsQueryDto } from '../dto/get-projects-query.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project, 'softwareConnection')
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(query: GetProjectsQueryDto = {}): Promise<Project[]> {
    const { status, search, lang } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.projectRepository.createQueryBuilder('proj');

    if (lang) {
      qb.andWhere('proj.language = :lang', { lang });
    }

    if (status && status !== 'all') {
      qb.andWhere('proj.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(proj.name LIKE :search OR proj.description LIKE :search OR proj.techStack LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Algoritmo de Inteligencia Editorial (SmartScore con ponderación Stars)
    qb.addSelect(
      '((proj.featured * 1000) + (proj.orderPriority * 20) + (proj.stars * 10) + (proj.views * 1.5))',
      'smart_score',
    );
    qb.orderBy('smart_score', 'DESC');
    qb.addOrderBy('proj.createdAt', 'DESC');
    qb.addOrderBy('proj.id', 'DESC');

    // Techo de seguridad de memoria para VPS 1 GB RAM
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

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      status: createProjectDto.status || 'active',
    });
    return this.projectRepository.save(project);
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(String(id));
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Proyecto #${id} no encontrado`);
    }
  }

  async getCategories(
    lang: string = 'es',
  ): Promise<Array<{ id: string; label: string; count: number }>> {
    const qb = this.projectRepository.createQueryBuilder('proj');
    if (lang) {
      qb.andWhere('proj.language = :lang', { lang });
    }

    const allProjects = await qb.select(['proj.status']).getMany();
    const countMap = new Map<string, number>();

    for (const proj of allProjects) {
      if (proj.status) {
        const s = proj.status.toLowerCase();
        countMap.set(s, (countMap.get(s) || 0) + 1);
      }
    }

    const labelsEs: Record<string, string> = {
      all: 'Todos los proyectos',
      active: 'En Producción',
      wip: 'En Desarrollo',
      archived: 'Archivado',
      beta: 'Fase Beta',
    };

    const labelsEn: Record<string, string> = {
      all: 'All Projects',
      active: 'In Production',
      wip: 'In Development',
      archived: 'Archived',
      beta: 'Beta Phase',
    };

    const labels = lang === 'en' ? labelsEn : labelsEs;

    const result: Array<{ id: string; label: string; count: number }> = [
      {
        id: 'all',
        label:
          labels.all ||
          (lang === 'en' ? 'All Projects' : 'Todos los proyectos'),
        count: allProjects.length,
      },
    ];

    const statusOrder = ['active', 'wip', 'beta', 'archived'];
    for (const s of statusOrder) {
      const count = countMap.get(s) || 0;
      if (count > 0) {
        result.push({
          id: s,
          label: labels[s] || s,
          count,
        });
      }
    }

    return result;
  }
}
