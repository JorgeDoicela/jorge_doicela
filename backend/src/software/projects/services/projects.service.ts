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

  async findAll(status?: ProjectStatus, search?: string): Promise<Project[]> {
    const qb = this.projectRepository.createQueryBuilder('proj');

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
    return qb.getMany();
  }

  async findOne(idOrSlug: string): Promise<Project> {
    const isId = !isNaN(Number(idOrSlug));
    const project = isId
      ? await this.projectRepository.findOne({
          where: { id: Number(idOrSlug) },
        })
      : await this.projectRepository.findOne({ where: { slug: idOrSlug } });

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
