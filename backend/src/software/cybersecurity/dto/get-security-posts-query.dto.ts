import { IsOptional, IsIn } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';
import type {
  SecuritySeverity,
  SecurityPostType,
} from '../entities/security-post.entity';

const SEVERITIES: Array<SecuritySeverity | 'all'> = [
  'all',
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
];

const POST_TYPES: SecurityPostType[] = [
  'advisory',
  'hardening_guide',
  'writeup',
];

export class GetSecurityPostsQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsIn(SEVERITIES, {
    message: 'La severidad debe ser LOW, MEDIUM, HIGH o CRITICAL',
  })
  severity?: SecuritySeverity | 'all';

  @IsOptional()
  @IsIn(POST_TYPES, {
    message: 'El tipo debe ser advisory, hardening_guide o writeup',
  })
  postType?: SecurityPostType;
}
