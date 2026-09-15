import { IsOptional, IsIn } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';
import type {
  InfrastructureCategory,
  InfrastructureEnvironment,
  InfrastructureDifficulty,
} from '../entities/infrastructure-post.entity';

const CATEGORIES: InfrastructureCategory[] = [
  'cloud',
  'servers',
  'containers',
  'networking',
  'ci_cd',
  'hardening',
  'zero_ram',
];

const ENVIRONMENTS: InfrastructureEnvironment[] = [
  'production',
  'edge',
  'hybrid',
  'vps',
  'bare_metal',
];

const DIFFICULTIES: InfrastructureDifficulty[] = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
];

const SORT_BY_OPTIONS = [
  'smart',
  'recent',
  'views',
  'likes',
  'difficulty',
] as const;
export type InfraSortBy = (typeof SORT_BY_OPTIONS)[number];

export class GetInfrastructureQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsIn(CATEGORIES, {
    message:
      'La categoría debe ser: cloud, servers, containers, networking, ci_cd, hardening o zero_ram',
  })
  category?: InfrastructureCategory;

  @IsOptional()
  @IsIn(ENVIRONMENTS, {
    message: 'El entorno debe ser: production, edge, hybrid, vps o bare_metal',
  })
  environment?: InfrastructureEnvironment;

  @IsOptional()
  @IsIn(DIFFICULTIES, {
    message:
      'La dificultad debe ser: beginner, intermediate, advanced o expert',
  })
  difficulty?: InfrastructureDifficulty;

  @IsOptional()
  @IsIn(SORT_BY_OPTIONS, {
    message:
      'El ordenamiento debe ser: smart, recent, views, likes o difficulty',
  })
  sortBy?: InfraSortBy = 'smart';
}
