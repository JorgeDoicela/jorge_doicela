import { IsOptional, IsIn } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';
import type { ProjectStatus } from '../entities/project.entity';

const PROJECT_STATUSES: ProjectStatus[] = ['active', 'archived', 'wip'];

export class GetProjectsQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsIn(PROJECT_STATUSES, {
    message: 'El estado debe ser active, archived o wip',
  })
  status?: ProjectStatus;
}
