import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SubscribeNewsletterDto {
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail(
    {},
    { message: 'El correo electrónico debe ser una dirección válida.' },
  )
  @MaxLength(255, { message: 'El correo no puede exceder los 255 caracteres.' })
  @Transform(({ value }: { value: unknown }): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : '',
  )
  email: string;

  @IsOptional()
  @IsString({ message: 'El origen debe ser una cadena de texto.' })
  @MaxLength(64)
  source?: string;

  @IsOptional()
  @IsString({ message: 'El idioma debe ser una cadena de texto.' })
  @MaxLength(5)
  language?: string;
}
