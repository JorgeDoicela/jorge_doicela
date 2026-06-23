import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class SoftwareService implements OnModuleInit {
  constructor(
    @InjectRepository(Project, 'softwareConnection')
    private readonly projectRepository: Repository<Project>,
  ) {}

  async onModuleInit() {
    const count = await this.projectRepository.count();
    if (count === 0) {
      await this.projectRepository.save([
        {
          name: 'Portafolio Personal',
          description:
            'Mi sitio web personal interactivo con terminal virtual SSH integrada.',
          techStack: 'Next.js, TailwindCSS, Socket.io, NestJS',
          repoUrl: 'https://github.com/jorge/portfolio',
          liveUrl: 'https://jorgedoicela.com',
        },
        {
          name: 'Biblia App',
          description:
            'Un motor de consulta y lectura de la Biblia con soporte multi-versión y baja latencia.',
          techStack: 'Next.js, NestJS, SQLite, TypeORM',
          repoUrl: 'https://github.com/jorge/bible-app',
        },
        {
          name: 'DIITRA Web',
          description:
            'Plataforma para gestión y visualización de impactos académicos y científicos.',
          techStack: 'React, Vite, TailwindCSS, TypeScript',
          repoUrl: 'https://github.com/jorge/diitra-web',
        },
      ]);
    }
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findOne(id: number): Promise<Project | null> {
    return this.projectRepository.findOneBy({ id });
  }
}
