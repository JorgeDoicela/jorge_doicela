import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCommentariesQueryDto {
  @IsOptional()
  @IsString()
  bookId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  chapter?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  verse?: number;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['book_intro', 'chapter_intro', 'passage'])
  entryType?: 'book_intro' | 'chapter_intro' | 'passage';

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
  @Max(200)
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
  @Min(0)
  verse?: number;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  lang?: string;
}

export class GetCommentariesCoverageQueryDto {
  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  lang?: string;
}
