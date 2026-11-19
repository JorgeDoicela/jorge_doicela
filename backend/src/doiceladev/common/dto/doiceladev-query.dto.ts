import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export type DoiceladevSortBy = 'smart' | 'recent' | 'popular';

export class DoiceladevQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro search debe ser una cadena de texto.' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro lang debe ser una cadena de texto.' })
  lang?: string = 'es';

  @IsOptional()
  @IsString({ message: 'El parámetro tag debe ser una cadena de texto.' })
  tag?: string;

  @IsOptional()
  @IsIn(['smart', 'recent', 'popular'], {
    message: 'El parámetro sortBy debe ser smart, recent o popular.',
  })
  sortBy?: DoiceladevSortBy = 'smart';

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
