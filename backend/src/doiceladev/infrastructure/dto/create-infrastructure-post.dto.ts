import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import type { InfrastructureCategory } from '../entities/infrastructure-post.entity';

export class CreateInfrastructurePostDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  category?: InfrastructureCategory;

  @IsString()
  @IsOptional()
  techStack?: string;

  @IsString()
  @IsOptional()
  architectureOverview?: string;

  @IsString()
  @IsOptional()
  specs?: string;

  @IsString()
  @IsNotEmpty()
  contentMarkdown: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsOptional()
  featured?: boolean;

  @IsOptional()
  orderPriority?: number;

  @IsOptional()
  publishedAt?: Date | string;
}
