import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateContactMessageDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
  name: string;

  @IsEmail(
    {},
    {
      message: 'El correo electrónico debe ser una dirección de email válida.',
    },
  )
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @MaxLength(150, {
    message: 'El correo electrónico no puede exceder los 150 caracteres.',
  })
  email: string;

  @IsString({ message: 'El asunto debe ser un texto.' })
  @IsOptional()
  @MaxLength(200, {
    message: 'El asunto no puede exceder los 200 caracteres.',
  })
  subject?: string;

  @IsString({ message: 'El teléfono debe ser un texto.' })
  @IsOptional()
  @MaxLength(50, {
    message: 'El teléfono no puede exceder los 50 caracteres.',
  })
  phone?: string;

  @IsString({ message: 'El tipo de servicio debe ser un texto.' })
  @IsOptional()
  @MaxLength(100, {
    message: 'El tipo de servicio no puede exceder los 100 caracteres.',
  })
  serviceType?: string;

  @IsString({ message: 'El mensaje debe ser un texto.' })
  @IsNotEmpty({ message: 'El mensaje es obligatorio.' })
  @MaxLength(3000, {
    message: 'El mensaje no puede exceder los 3000 caracteres.',
  })
  message: string;
}
