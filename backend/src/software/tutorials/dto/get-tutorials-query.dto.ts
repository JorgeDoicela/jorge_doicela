import { IsOptional, IsIn } from 'class-validator';
import { SoftwareQueryDto } from '../../common/dto/software-query.dto';
import type { TutorialDifficulty } from '../entities/tutorial.entity';

const DIFFICULTIES: Array<TutorialDifficulty | 'all'> = [
  'all',
  'beginner',
  'intermediate',
  'advanced',
];

export class GetTutorialsQueryDto extends SoftwareQueryDto {
  @IsOptional()
  @IsIn(DIFFICULTIES, {
    message: 'La dificultad debe ser beginner, intermediate o advanced',
  })
  difficulty?: TutorialDifficulty | 'all';
}
