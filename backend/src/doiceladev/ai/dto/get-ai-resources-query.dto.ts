import { IsOptional, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import { AiCategory } from '../entities/ai-resource.entity';

export class GetAiResourcesQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn([
    'all',
    'llm',
    'agent',
    'framework',
    'mcp_server',
    'tool',
    'dataset',
    'platform',
  ])
  category?: AiCategory | 'all';
}
