import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetVersesFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El filtro por libro debe ser un identificador numérico entero.',
  })
  @Min(1)
  bookId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message:
      'El filtro por traducción debe ser un identificador numérico entero.',
  })
  @Min(1)
  translationId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El filtro por capítulo debe ser un número entero.' })
  @Min(1, { message: 'El capítulo mínimo de búsqueda debe ser 1.' })
  chapter?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite de paginación debe ser un número entero.' })
  @Min(1, { message: 'El límite mínimo de paginación es 1.' })
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El offset de paginación debe ser un número entero.' })
  @Min(0, { message: 'El offset mínimo de paginación es 0.' })
  offset?: number = 0;
}
