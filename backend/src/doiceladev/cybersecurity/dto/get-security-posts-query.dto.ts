import { IsOptional, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import type { SecurityCategory } from '../entities/security-post.entity';

const SECURITY_CATEGORIES: Array<SecurityCategory | 'all'> = [
  'all',
  'advisory',
  'hardening_guide',
  'writeup',
  'cve_analysis',
  'pentest',
];

export class GetSecurityPostsQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn(SECURITY_CATEGORIES, {
    message:
      'La categoría debe ser: advisory, hardening_guide, writeup, cve_analysis o pentest',
  })
  category?: SecurityCategory | 'all';
}
