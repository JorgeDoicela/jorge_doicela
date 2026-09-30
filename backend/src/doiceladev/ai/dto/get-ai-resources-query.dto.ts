import { IsOptional, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import type { AiCategory } from '../entities/ai-resource.entity';

const AI_CATEGORIES: Array<AiCategory | 'all'> = [
  'all',
  'llm',
  'agent',
  'framework',
  'mcp_server',
  'tool',
  'dataset',
  'platform',
];

export class GetAiResourcesQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn(AI_CATEGORIES, {
    message:
      'La categoría debe ser: llm, agent, framework, mcp_server, tool, dataset o platform',
  })
  category?: AiCategory | 'all';
}
