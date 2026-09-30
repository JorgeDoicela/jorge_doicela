import { IsOptional, IsIn, IsString } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import type { ProjectStatus } from '../entities/project.entity';

const PROJECT_STATUSES: Array<ProjectStatus | 'all'> = [
  'all',
  'active',
  'archived',
  'wip',
];

export class GetProjectsQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn(PROJECT_STATUSES, {
    message: 'El estado debe ser active, archived o wip',
  })
  status?: ProjectStatus | 'all';

  @IsOptional()
  @IsString({ message: 'El parámetro category debe ser una cadena de texto.' })
  category?: string;
}
