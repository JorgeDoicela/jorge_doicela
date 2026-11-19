import { IsOptional, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import { SecurityCategory } from '../entities/security-post.entity';

export class GetSecurityPostsQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn([
    'all',
    'advisory',
    'hardening_guide',
    'writeup',
    'cve_analysis',
    'pentest',
  ])
  category?: SecurityCategory | 'all';
}
