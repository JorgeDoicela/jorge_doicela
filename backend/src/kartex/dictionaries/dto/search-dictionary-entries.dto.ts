import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDictionaryEntriesDto {
  @IsOptional()
  @IsString()
  dictionaryId?: string;

  @IsOptional()
  @IsString()
  letter?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  lang?: string;
}
