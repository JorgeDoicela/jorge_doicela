import { IsOptional, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import { InfrastructureCategory } from '../entities/infrastructure-post.entity';

export class GetInfrastructureQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn([
    'all',
    'cloud',
    'servers',
    'containers',
    'networking',
    'ci_cd',
    'hardening',
    'zero_ram',
    'monitoring',
    'security',
  ])
  category?: InfrastructureCategory | 'all';
}
