import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateWakeRequestDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsOptional()
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
  name?: string;

  @IsString({ message: 'El contacto debe ser un texto.' })
  @IsOptional()
  @MaxLength(150, {
    message: 'El contacto no puede exceder los 150 caracteres.',
  })
  contact?: string;

  @IsString({ message: 'La nota debe ser un texto.' })
  @IsOptional()
  @MaxLength(500, { message: 'La nota no puede exceder los 500 caracteres.' })
  note?: string;
}
