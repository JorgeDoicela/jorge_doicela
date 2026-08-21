import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

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

  @IsString()
  @IsOptional()
  series?: string;

  @IsString()
  @IsOptional()
  tableOfContents?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsNumber()
  @IsOptional()
  readTimeMinutes?: number;
}
