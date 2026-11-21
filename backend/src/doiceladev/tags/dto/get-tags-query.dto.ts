import { IsOptional, IsString } from 'class-validator';

export class GetTagsQueryDto {
  @IsOptional()
  @IsString()
  lang?: string = 'es';
}
