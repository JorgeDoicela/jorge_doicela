import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { CommentariesService } from '../services/commentaries.service';
import { GetCommentariesQueryDto } from '../dto/get-commentaries-query.dto';
import { CommentaryAuthorEntity } from '../entities/commentary-author.entity';
import { CommentaryEntryEntity } from '../entities/commentary-entry.entity';

@Controller('kartex/commentaries')
export class CommentariesController {
  constructor(private readonly commentariesService: CommentariesService) {}

  @Get()
  async getCommentaries(
    @Query() query: GetCommentariesQueryDto,
  ): Promise<CommentaryEntryEntity[]> {
    return this.commentariesService.getCommentaries(query);
  }

  @Get('authors')
  async getAuthors(
    @Query('lang') lang?: string,
  ): Promise<CommentaryAuthorEntity[]> {
    return this.commentariesService.getAuthors(lang);
  }

  @Get('authors/:id')
  async getAuthorById(
    @Param('id') id: string,
    @Query('lang') lang?: string,
  ): Promise<CommentaryAuthorEntity> {
    return this.commentariesService.getAuthorById(id, lang);
  }

  @Get('passage/:bookId/:chapter')
  async getByPassage(
    @Param('bookId') bookId: string,
    @Param('chapter', ParseIntPipe) chapter: number,
    @Query('verse') verse?: string,
    @Query('lang') lang?: string,
  ): Promise<CommentaryEntryEntity[]> {
    const parsedVerse = verse ? parseInt(verse, 10) : undefined;
    return this.commentariesService.getCommentariesByPassage(
      bookId,
      chapter,
      Number.isNaN(parsedVerse) ? undefined : parsedVerse,
      lang,
    );
  }
}
