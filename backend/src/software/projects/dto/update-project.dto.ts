import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import type { ProjectStatus } from '../entities/project.entity';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  techStack?: string;

  @IsString()
  @IsOptional()
  repoUrl?: string;

  @IsString()
  @IsOptional()
  liveUrl?: string;

  @IsString()
  @IsOptional()
  status?: ProjectStatus;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsNumber()
  @IsOptional()
  stars?: number;

  @IsString()
  @IsOptional()
  architectureDiagramUrl?: string;
}
