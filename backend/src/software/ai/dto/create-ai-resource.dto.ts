import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAiResourceDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  contentMarkdown: string;

  @IsString()
  @IsOptional()
  license?: string;

  @IsString()
  @IsOptional()
  documentationUrl?: string;

  @IsString()
  @IsOptional()
  paperUrl?: string;

  @IsString()
  @IsOptional()
  githubUrl?: string;

  @IsString()
  @IsOptional()
  tags?: string;
}
