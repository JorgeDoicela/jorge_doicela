import { IsOptional, IsString } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';

export class GetBlogQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro series debe ser una cadena de texto.' })
  series?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro tag debe ser una cadena de texto.' })
  tag?: string;

  @IsOptional()
  @IsString({ message: 'El parámetro category debe ser una cadena de texto.' })
  category?: string;
}
