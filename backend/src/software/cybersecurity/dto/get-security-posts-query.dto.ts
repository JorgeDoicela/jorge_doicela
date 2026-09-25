import { IsOptional, IsIn } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';
import type {
  SecuritySeverity,
  SecurityCategory,
} from '../entities/security-post.entity';

const SEVERITIES: Array<SecuritySeverity | 'all'> = [
  'all',
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
];

const SECURITY_CATEGORIES: Array<SecurityCategory | 'all'> = [
  'all',
  'advisory',
  'hardening_guide',
  'writeup',
  'cve_analysis',
  'pentest',
];

export class GetSecurityPostsQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsIn(SEVERITIES, {
    message: 'La severidad debe ser LOW, MEDIUM, HIGH o CRITICAL',
  })
  severity?: SecuritySeverity | 'all';

  @IsOptional()
  @IsIn(SECURITY_CATEGORIES, {
    message:
      'La categoría debe ser: advisory, hardening_guide, writeup, cve_analysis o pentest',
  })
  category?: SecurityCategory | 'all';
}
