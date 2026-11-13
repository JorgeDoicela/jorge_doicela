import { IsEmail, IsOptional, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UnsubscribeNewsletterDto {
  @IsOptional()
  @Matches(/^[a-f0-9]{32,64}$/i, {
    message: 'El token de baja no tiene un formato válido.',
  })
  @Transform(({ value }: { value: unknown }): string | undefined =>
    typeof value === 'string' ? value.trim().toLowerCase() : undefined,
  )
  token?: string;

  @IsOptional()
  @IsEmail(
    { allow_ip_domain: false, ignore_max_length: false },
    { message: 'El correo electrónico debe ser una dirección válida.' },
  )
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, {
    message: 'El correo contiene caracteres no permitidos o formato inválido.',
  })
  @MaxLength(255, { message: 'El correo no puede exceder los 255 caracteres.' })
  @Transform(({ value }: { value: unknown }): string | undefined =>
    typeof value === 'string' ? value.trim().toLowerCase() : undefined,
  )
  email?: string;
}
