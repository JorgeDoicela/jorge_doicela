import { IsOptional, IsString } from 'class-validator';

export class GetForumTopicsQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro category debe ser una cadena de texto.' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro search debe ser una cadena de texto.' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro lang debe ser una cadena de texto.' })
  lang?: string = 'es';
}
