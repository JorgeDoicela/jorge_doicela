import { IsOptional, IsString } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';

export class GetForumTopicsQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro category debe ser una cadena de texto.' })
  category?: string;
}
