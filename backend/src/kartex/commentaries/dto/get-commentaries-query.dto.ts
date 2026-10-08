import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCommentariesQueryDto {
  @IsOptional()
  @IsString()
  bookId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  chapter?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  verse?: number;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}

export class GetCommentariesPassageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  verse?: number;

  @IsOptional()
  @IsString()
  lang?: string;
}
