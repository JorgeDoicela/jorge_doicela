import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class VotePollOptionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  previousOptionId?: number;
}
