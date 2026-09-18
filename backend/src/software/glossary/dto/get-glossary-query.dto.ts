import { IsOptional, IsString } from 'class-validator';

export class GetGlossaryQueryDto {
  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
