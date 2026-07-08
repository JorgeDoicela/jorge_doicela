import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateVerseDto {
  @IsInt({ message: 'El ID del libro debe ser un número entero.' })
  @Min(1, { message: 'El ID del libro debe ser un identificador válido.' })
  bookId: number;

  @IsInt({ message: 'El ID de la traducción debe ser un número entero.' })
  @Min(1, {
    message: 'El ID de la traducción debe ser un identificador válido.',
  })
  translationId: number;

  @IsInt({ message: 'El número de capítulo debe ser un número entero.' })
  @Min(1, { message: 'El número de capítulo debe ser mayor o igual a 1.' })
  chapter: number;

  @IsInt({ message: 'El número de versículo debe ser un número entero.' })
  @Min(1, { message: 'El número de versículo debe ser mayor o igual a 1.' })
  verseNumber: number;

  @IsString({ message: 'El texto del versículo debe ser un texto.' })
  @IsNotEmpty({ message: 'El texto del versículo es obligatorio.' })
  text: string;
}
