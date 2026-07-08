import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateContactMessageDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @IsEmail(
    {},
    {
      message: 'El correo electrónico debe ser una dirección de email válida.',
    },
  )
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @IsString({ message: 'El asunto debe ser un texto.' })
  @IsNotEmpty({ message: 'El asunto es obligatorio.' })
  subject: string;

  @IsString({ message: 'El mensaje debe ser un texto.' })
  @IsNotEmpty({ message: 'El mensaje es obligatorio.' })
  message: string;
}
