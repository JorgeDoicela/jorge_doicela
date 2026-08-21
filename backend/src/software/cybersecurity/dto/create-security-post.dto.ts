import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import type {
  SecuritySeverity,
  SecurityPostType,
} from '../entities/security-post.entity';

export class CreateSecurityPostDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  severity?: SecuritySeverity;

  @IsString()
  @IsOptional()
  postType?: SecurityPostType;

  @IsString()
  @IsOptional()
  cveId?: string;

  @IsString()
  @IsOptional()
  affectedSystems?: string;

  @IsString()
  @IsOptional()
  remediation?: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  contentMarkdown: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  tags?: string;
}
