import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString({ message: 'El nombre del proyecto debe ser un texto.' })
  @IsNotEmpty({
    message: 'El nombre del proyecto es obligatorio si se provee.',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'La descripción del proyecto debe ser un texto.' })
  @IsNotEmpty({
    message: 'La descripción del proyecto es obligatoria si se provee.',
  })
  description?: string;

  @IsOptional()
  @IsString({ message: 'El tech stack debe ser un texto.' })
  @IsNotEmpty({ message: 'El tech stack es obligatorio si se provee.' })
  techStack?: string;

  @IsOptional()
  @IsUrl({}, { message: 'El enlace del repositorio debe ser una URL válida.' })
  repoUrl?: string;

  @IsOptional()
  @IsUrl(
    {},
    { message: 'El enlace del sitio en vivo debe ser una URL válida.' },
  )
  liveUrl?: string;
}
