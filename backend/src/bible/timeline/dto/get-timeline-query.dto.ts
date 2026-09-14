import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTimelineQueryDto {
  @IsOptional()
  @IsString({ message: 'El tipo de evento debe ser una cadena de texto.' })
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El año inicial debe ser un número entero.' })
  from?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El año final debe ser un número entero.' })
  to?: number;

  @IsOptional()
  @IsString({ message: 'El idioma debe ser una cadena de texto.' })
  lang?: string = 'es';
}
