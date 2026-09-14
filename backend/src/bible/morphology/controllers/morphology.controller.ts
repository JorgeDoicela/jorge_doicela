import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MorphologyService } from '../services/morphology.service';
import { MorphologyToken } from '../entities/morphology-token.entity';
import { LexiconEntry } from '../entities/lexicon-entry.entity';
import { GetPassageTokensDto } from '../dto/get-passage-tokens.dto';
import { SearchLexiconDto } from '../dto/search-lexicon.dto';

@Controller('bible/morphology')
export class MorphologyController {
  constructor(private readonly morphologyService: MorphologyService) {}

  @Get('passage')
  async getTokensByPassage(
    @Query() query: GetPassageTokensDto,
  ): Promise<MorphologyToken[]> {
    if (!query.book) return [];
    return this.morphologyService.getTokensByPassage(query.book, query.chapter);
  }

  @Get('verse/:verseId')
  async getTokensByVerse(
    @Param('verseId', ParseIntPipe) verseId: number,
  ): Promise<MorphologyToken[]> {
    return this.morphologyService.getTokensByVerse(verseId);
  }

  @Get('lexicon/:strongCode')
  async getLexiconEntry(
    @Param('strongCode') strongCode: string,
  ): Promise<LexiconEntry> {
    return this.morphologyService.getLexiconEntry(strongCode);
  }

  @Get('lexicon')
  async searchLexicon(
    @Query() query: SearchLexiconDto,
  ): Promise<LexiconEntry[]> {
    return this.morphologyService.searchLexicon(
      query.q,
      query.lang,
      query.limit ?? 30,
    );
  }
}
