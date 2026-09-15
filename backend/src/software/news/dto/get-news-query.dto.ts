import { IsOptional, IsString } from 'class-validator';

export class GetNewsQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro search debe ser una cadena de texto.' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro tag debe ser una cadena de texto.' })
  tag?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro lang debe ser una cadena de texto.' })
  lang?: string = 'es';
}
