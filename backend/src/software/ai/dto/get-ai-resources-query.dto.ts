import { IsOptional, IsIn } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';
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

export class GetAiResourcesQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsIn(AI_CATEGORIES, {
    message:
      'La categoría debe ser: llm, agent, framework, mcp_server, tool, dataset o platform',
  })
  category?: AiCategory | 'all';
}
