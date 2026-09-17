import { IsOptional, IsIn } from 'class-validator';

export class GetBooksFilterDto {
  @IsOptional()
  @IsIn(['OT', 'NT'], {
    message:
      'El testamento debe ser OT (Antiguo Testamento) o NT (Nuevo Testamento).',
  })
  testament?: 'OT' | 'NT';
}
