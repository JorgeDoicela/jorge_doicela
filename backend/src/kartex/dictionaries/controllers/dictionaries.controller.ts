import { Controller, Get, Param, Query } from '@nestjs/common';
import { DictionariesService } from '../services/dictionaries.service';
import { SearchDictionaryEntriesDto } from '../dto/search-dictionary-entries.dto';
import { GetDictionariesQueryDto } from '../dto/get-dictionaries-query.dto';
import { BibleDictionaryEntity } from '../entities/bible-dictionary.entity';
import { BibleDictionaryEntryEntity } from '../entities/bible-dictionary-entry.entity';

@Controller('kartex/dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  /**
   * Catálogo de diccionarios bíblicos disponibles
   * GET /api/kartex/dictionaries?lang=es
   */
  @Get()
  async getDictionaries(
    @Query() query: GetDictionariesQueryDto,
  ): Promise<BibleDictionaryEntity[]> {
    return this.dictionariesService.findAllDictionaries(query.lang || 'es');
  }

  /**
   * Recuento de términos disponibles por letra A-Z
   * GET /api/kartex/dictionaries/letters?dictionaryId=easton-1897-es&lang=es
   */
  @Get('letters')
  async getLetters(
    @Query('dictionaryId') dictionaryId?: string,
    @Query('lang') lang?: string,
  ): Promise<{ letter: string; count: number }[]> {
    return this.dictionariesService.getAvailableLetters(
      dictionaryId,
      lang || 'es',
    );
  }

  /**
   * Búsqueda transversal multiautor de un término
   * GET /api/kartex/dictionaries/lookup/:term?lang=es
   */
  @Get('lookup/:term')
  async lookupTerm(
    @Param('term') term: string,
    @Query('lang') lang?: string,
  ): Promise<BibleDictionaryEntryEntity[]> {
    return this.dictionariesService.lookupTerm(term, lang || 'es');
  }

  /**
   * Búsqueda paginada e indexada de entradas de diccionario
   * GET /api/kartex/dictionaries/entries?dictionaryId=...&letter=A&q=...&page=1&limit=20&lang=es
   */
  @Get('entries')
  async searchEntries(@Query() query: SearchDictionaryEntriesDto) {
    return this.dictionariesService.searchEntries(query);
  }

  /**
   * Detalle completo de una entrada por su ID
   * GET /api/kartex/dictionaries/entries/:id?lang=es
   */
  @Get('entries/:id')
  async getEntryById(
    @Param('id') id: string,
    @Query('lang') lang?: string,
  ): Promise<BibleDictionaryEntryEntity> {
    return this.dictionariesService.findEntryById(id, lang || 'es');
  }

  /**
   * Detalle y ficha técnica de un diccionario
   * GET /api/kartex/dictionaries/:id?lang=es
   */
  @Get(':id')
  async getDictionaryById(
    @Param('id') id: string,
    @Query('lang') lang?: string,
  ): Promise<BibleDictionaryEntity> {
    return this.dictionariesService.findDictionaryById(id, lang || 'es');
  }
}
