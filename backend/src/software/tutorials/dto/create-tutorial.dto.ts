import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import type { TutorialDifficulty } from '../entities/tutorial.entity';

export class CreateTutorialDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  difficulty?: TutorialDifficulty;

  @IsNumber()
  @IsOptional()
  estimatedMinutes?: number;

  @IsString()
  @IsOptional()
  prerequisites?: string;

  @IsString()
  @IsOptional()
  techStack?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;
}
