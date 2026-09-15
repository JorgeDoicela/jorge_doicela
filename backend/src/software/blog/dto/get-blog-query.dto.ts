import { IsOptional, IsString } from 'class-validator';

export class GetBlogQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro search debe ser una cadena de texto.' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro series debe ser una cadena de texto.' })
  series?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro lang debe ser una cadena de texto.' })
  lang?: string = 'es';
}
