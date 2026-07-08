import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'El nombre del libro debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre del libro es obligatorio.' })
  name: string;

  @IsString({ message: 'La abreviación del libro debe ser un texto.' })
  @IsNotEmpty({ message: 'La abreviación del libro es obligatoria.' })
  abbreviation: string;

  @IsIn(['OT', 'NT'], {
    message:
      'El testamento debe ser OT (Antiguo Testamento) o NT (Nuevo Testamento).',
  })
  testament: 'OT' | 'NT';
}
