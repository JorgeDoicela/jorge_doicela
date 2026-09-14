import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPassageTokensDto {
  @IsNotEmpty({ message: 'La abreviatura del libro es obligatoria.' })
  @IsString({ message: 'El libro debe ser una cadena de texto.' })
  book: string;

  @Type(() => Number)
  @IsInt({ message: 'El capítulo debe ser un número entero.' })
  @Min(1, { message: 'El capítulo mínimo es 1.' })
  chapter: number;
}
