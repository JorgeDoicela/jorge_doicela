import { IsOptional, IsIn, IsString } from 'class-validator';
import { DoiceladevQueryDto } from '../../common/dto/doiceladev-query.dto';
import type { TutorialDifficulty } from '../entities/tutorial.entity';

const DIFFICULTIES: Array<TutorialDifficulty | 'all'> = [
  'all',
  'beginner',
  'intermediate',
  'advanced',
];

export class GetTutorialsQueryDto extends DoiceladevQueryDto {
  @IsOptional()
  @IsIn(DIFFICULTIES, {
    message: 'La dificultad debe ser beginner, intermediate o advanced',
  })
  difficulty?: TutorialDifficulty | 'all';

  @IsOptional()
  @IsString({ message: 'El parámetro category debe ser una cadena de texto.' })
  category?: string;
}
