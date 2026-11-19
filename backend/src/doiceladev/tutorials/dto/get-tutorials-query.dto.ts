import { IsOptional, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import { TutorialCategory } from '../entities/tutorial.entity';

export class GetTutorialsQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn([
    'all',
    'web',
    'backend',
    'devops',
    'mobile',
    'ai',
    'databases',
    'security',
    'architecture',
  ])
  category?: TutorialCategory | 'all';
}
