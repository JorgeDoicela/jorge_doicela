import { IsOptional, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import { ProjectCategory, ProjectStatus } from '../entities/project.entity';

export class GetProjectsQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn([
    'all',
    'web',
    'backend',
    'mobile',
    'devops',
    'ai',
    'open_source',
    'tool',
  ])
  category?: ProjectCategory | 'all';

  @IsOptional()
  @IsIn(['all', 'active', 'archived', 'wip'])
  status?: ProjectStatus | 'all';
}
