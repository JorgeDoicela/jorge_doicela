import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MorphologyService } from '../services/morphology.service';
import { MorphologyToken } from '../entities/morphology-token.entity';
import { LexiconEntry } from '../entities/lexicon-entry.entity';

@Controller('bible/morphology')
export class MorphologyController {
  constructor(private readonly morphologyService: MorphologyService) {}

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
  async searchLexicon(@Query('q') query?: string): Promise<LexiconEntry[]> {
    if (!query || query.trim() === '') {
      return [];
    }
    return this.morphologyService.searchLexicon(query);
  }
}
