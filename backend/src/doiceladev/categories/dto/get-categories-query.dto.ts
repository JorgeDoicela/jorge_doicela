import { IsOptional, IsString } from 'class-validator';

export class GetCategoriesQueryDto {
  @IsOptional()
  @IsString()
  lang?: string = 'es';
}
