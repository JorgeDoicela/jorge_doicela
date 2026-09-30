import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateForumReplyDto {
  @IsNumber()
  @IsNotEmpty()
  topicId: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  author?: string;
}
