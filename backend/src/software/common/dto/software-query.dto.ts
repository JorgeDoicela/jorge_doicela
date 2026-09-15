import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SoftwareQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro search debe ser una cadena de texto.' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro lang debe ser una cadena de texto.' })
  lang?: string = 'es';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El parámetro limit debe ser un número entero.' })
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El parámetro page debe ser un número entero.' })
  @Min(1)
  page?: number = 1;
}
