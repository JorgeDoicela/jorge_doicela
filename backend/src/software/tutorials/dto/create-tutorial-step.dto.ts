import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTutorialStepDto {
  @IsNumber()
  @IsNotEmpty()
  tutorialId: number;

  @IsNumber()
  @IsOptional()
  stepOrder?: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  contentMarkdown: string;

  @IsString()
  @IsOptional()
  codeSnippet?: string;

  @IsString()
  @IsOptional()
  codeLanguage?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
