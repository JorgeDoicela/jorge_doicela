import { IsOptional, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import { ForumCategory } from '../entities/forum-topic.entity';

export class GetForumTopicsQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn([
    'all',
    'architecture',
    'devops',
    'ai',
    'frontend',
    'backend',
    'help',
    'general',
  ])
  category?: ForumCategory | 'all';
}
