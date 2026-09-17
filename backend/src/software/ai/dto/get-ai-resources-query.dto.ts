import { IsOptional, IsIn } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';
import type { AiResourceType } from '../entities/ai-resource.entity';

const AI_RESOURCE_TYPES: Array<AiResourceType | 'all'> = [
  'all',
  'llm',
  'agent',
  'framework',
  'mcp_server',
  'tool',
];

export class GetAiResourcesQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsIn(AI_RESOURCE_TYPES, {
    message: 'El tipo debe ser: llm, agent, framework, mcp_server o tool',
  })
  type?: AiResourceType | 'all';
}
