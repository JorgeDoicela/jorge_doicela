import { IsOptional, IsString, IsIn } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import { BlogCategory } from '../entities/blog-post.entity';

export class GetBlogQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsString({ message: 'El parámetro series debe ser una cadena de texto.' })
  series?: string;

  @IsOptional()
  @IsIn(['all', 'lessons', 'postmortems', 'opinion', 'career', 'journal'])
  category?: BlogCategory | 'all';
}
