import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SubscribeNewsletterDto {
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail(
    { allow_ip_domain: false, ignore_max_length: false },
    { message: 'El correo electrónico debe ser una dirección válida.' },
  )
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, {
    message: 'El correo contiene caracteres no permitidos o formato inválido.',
  })
  @MaxLength(255, { message: 'El correo no puede exceder los 255 caracteres.' })
  @Transform(({ value }: { value: unknown }): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : '',
  )
  email: string;

  @IsOptional()
  @IsString({ message: 'El origen debe ser una cadena de texto.' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'El origen contiene caracteres no permitidos.',
  })
  @MaxLength(64)
  source?: string;

  @IsOptional()
  @IsIn(['es', 'en'], { message: 'El idioma debe ser es o en.' })
  language?: string;
}
