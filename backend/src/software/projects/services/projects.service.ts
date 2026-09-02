import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project, 'softwareConnection')
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(
    status?: ProjectStatus,
    search?: string,
    lang?: string,
  ): Promise<Project[]> {
    const qb = this.projectRepository.createQueryBuilder('proj');

    if (lang) {
      qb.andWhere('proj.language = :lang', { lang });
    }

    if (status) {
      qb.andWhere('proj.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(proj.name LIKE :search OR proj.description LIKE :search OR proj.techStack LIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('proj.featured', 'DESC').addOrderBy('proj.createdAt', 'DESC');
    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll(status, search, 'es');
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

    project.views += 1;
    await this.projectRepository.save(project);
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
    await this.projectRepository.delete(id);
  }
}
