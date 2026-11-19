import { IsOptional, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import { NewsCategory } from '../entities/news-article.entity';

export class GetNewsQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn([
    'all',
    'frameworks',
    'cloud',
    'ai',
    'devops',
    'security',
    'web',
    'tools',
    'databases',
  ])
  category?: NewsCategory | 'all';
}
