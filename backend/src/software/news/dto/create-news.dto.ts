import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  contentMarkdown: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsBoolean()
  @IsOptional()
  isBreaking?: boolean;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsNumber()
  @IsOptional()
  readTimeMinutes?: number;
}
