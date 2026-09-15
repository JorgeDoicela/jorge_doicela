import { IsOptional, IsString } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';

export class GetBlogQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro series debe ser una cadena de texto.' })
  series?: string;
}
