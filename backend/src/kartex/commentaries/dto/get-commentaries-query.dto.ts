import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCommentariesQueryDto {
  @IsOptional()
  @IsString()
  bookId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  chapter?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
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
}
