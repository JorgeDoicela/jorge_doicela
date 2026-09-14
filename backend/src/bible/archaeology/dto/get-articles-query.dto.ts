import { IsOptional, IsString } from 'class-validator';

export class GetArticlesQueryDto {
  @IsOptional()
  @IsString({ message: 'La categoría debe ser una cadena de texto.' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto.' })
  q?: string;

  @IsOptional()
  @IsString({ message: 'El idioma debe ser una cadena de texto.' })
  lang?: string = 'es';
}
