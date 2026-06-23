import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { SoftwareService } from './software.service';
import { Project } from './entities/project.entity';

@Controller('software/projects')
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return this.softwareService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    const project = await this.softwareService.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }
}
