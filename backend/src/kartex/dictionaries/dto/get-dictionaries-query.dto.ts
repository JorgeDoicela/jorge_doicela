import { IsOptional, IsString } from 'class-validator';

export class GetDictionariesQueryDto {
  @IsOptional()
  @IsString()
  lang?: string;
}
