import { IsOptional, IsString } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';

export class GetNewsQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro tag debe ser una cadena de texto.' })
  tag?: string;
}
