import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRecommendationsQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro module debe ser una cadena de texto.' })
  module?: string;

  @IsString({
    message: 'El parámetro slug es obligatorio para calcular la similitud.',
  })
  slug: string;

  @IsOptional()
  @IsString({ message: 'El parámetro lang debe ser una cadena de texto.' })
  lang?: string = 'es';

  @IsOptional()
  @IsString({
    message:
      'El parámetro exclude debe ser una lista de slugs separados por comas.',
  })
  exclude?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El parámetro limit debe ser un número entero.' })
  @Min(1)
  @Max(10)
  limit?: number = 3;
}
