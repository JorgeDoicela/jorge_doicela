import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateVerseDto {
  @IsOptional()
  @IsInt({ message: 'El ID del libro debe ser un número entero.' })
  @Min(1, { message: 'El ID del libro debe ser un identificador válido.' })
  bookId?: number;

  @IsOptional()
  @IsInt({ message: 'El ID de la traducción debe ser un número entero.' })
  @Min(1, {
    message: 'El ID de la traducción debe ser un identificador válido.',
  })
  translationId?: number;

  @IsOptional()
  @IsInt({ message: 'El número de capítulo debe ser un número entero.' })
  @Min(1, { message: 'El número de capítulo debe ser mayor o igual a 1.' })
  chapter?: number;

  @IsOptional()
  @IsInt({ message: 'El número de versículo debe ser un número entero.' })
  @Min(1, { message: 'El número de versículo debe ser mayor o igual a 1.' })
  verseNumber?: number;

  @IsOptional()
  @IsString({ message: 'El texto del versículo debe ser un texto.' })
  @IsNotEmpty({
    message: 'El texto del versículo es obligatorio si se provee.',
  })
  text?: string;
}
