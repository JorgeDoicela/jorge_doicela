import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateForumReplyDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  topicId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parentId?: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'La respuesta debe tener al menos 3 caracteres.' })
  @MaxLength(4000, {
    message: 'La respuesta no puede superar los 4000 caracteres.',
  })
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(60, { message: 'El nombre no puede superar los 60 caracteres.' })
  author?: string;
}
