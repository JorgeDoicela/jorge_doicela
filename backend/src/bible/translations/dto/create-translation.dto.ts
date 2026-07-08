import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTranslationDto {
  @IsString({ message: 'El nombre de la traducción debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre de la traducción es obligatorio.' })
  name: string;

  @IsString({ message: 'La abreviación de la traducción debe ser un texto.' })
  @IsNotEmpty({ message: 'La abreviación de la traducción es obligatoria.' })
  abbreviation: string;

  @IsString({ message: 'El idioma debe ser un texto.' })
  @IsNotEmpty({ message: 'El idioma es obligatorio.' })
  language: string;
}
