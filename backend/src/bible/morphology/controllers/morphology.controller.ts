import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MorphologyService } from '../services/morphology.service';
import { MorphologyToken } from '../entities/morphology-token.entity';
import { LexiconEntry } from '../entities/lexicon-entry.entity';

@Controller('bible/morphology')
export class MorphologyController {
  constructor(private readonly morphologyService: MorphologyService) {}

  @Get('passage')
  async getTokensByPassage(
    @Query('book') bookAbbr: string,
    @Query('chapter', ParseIntPipe) chapter: number,
  ): Promise<MorphologyToken[]> {
    if (!bookAbbr) return [];
    return this.morphologyService.getTokensByPassage(bookAbbr, chapter);
  }

  @Get('verse/:verseId')
  async getTokensByVerse(
    @Param('verseId', ParseIntPipe) verseId: number,
  ): Promise<MorphologyToken[]> {
    return this.morphologyService.getTokensByVerse(verseId);
  }

  @Get('tokens/search')
  async searchTokens(
    @Query('q') query?: string,
    @Query('book') book?: string,
    @Query('strong') strongCode?: string,
    @Query('morph') morphologyCode?: string,
    @Query('limit') limit?: string,
  ): Promise<MorphologyToken[]> {
    return this.morphologyService.searchTokens({
      query,
      book,
      strongCode,
      morphologyCode,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }

  @Get('lexicon/:strongCode')
  async getLexiconEntry(
    @Param('strongCode') strongCode: string,
  ): Promise<LexiconEntry> {
    return this.morphologyService.getLexiconEntry(strongCode);
  }

  @Get('lexicon')
  async searchLexicon(
    @Query('q') query?: string,
    @Query('lang') language?: string,
    @Query('limit') limit?: string,
  ): Promise<LexiconEntry[]> {
    return this.morphologyService.searchLexicon(
      query,
      language,
      limit ? parseInt(limit, 10) : 30,
    );
  }
}
