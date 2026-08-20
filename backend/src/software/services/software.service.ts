import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import {
  EntityNotFoundError,
  EntityConflictError,
} from '../../common/domain/domain-errors';

@Injectable()
export class SoftwareService {
  constructor(
    @InjectRepository(Project, 'softwareConnection')
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new EntityNotFoundError('Project', id);
    }
    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const existing = await this.projectRepository.findOneBy({
      name: createProjectDto.name,
    });

    if (existing) {
      throw new EntityConflictError(
        `Ya existe un proyecto registrado con el nombre ${createProjectDto.name}.`,
      );
    }

    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);

    if (updateProjectDto.name) {
      const existing = await this.projectRepository.findOneBy({
        name: updateProjectDto.name,
      });

      if (existing && existing.id !== id) {
        throw new EntityConflictError(
          `Ya existe otro proyecto registrado con el nombre ${updateProjectDto.name}.`,
        );
      }
    }

    const updatedProject = this.projectRepository.merge(
      project,
      updateProjectDto,
    );
    return this.projectRepository.save(updatedProject);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }
}
