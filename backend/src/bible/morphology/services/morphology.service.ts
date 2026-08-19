import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LexiconEntry } from '../entities/lexicon-entry.entity';
import { MorphologyToken } from '../entities/morphology-token.entity';
import { EntityNotFoundError } from '../../../common/domain/domain-errors';

@Injectable()
export class MorphologyService {
  constructor(
    @InjectRepository(LexiconEntry, 'bibleConnection')
    private readonly lexiconRepository: Repository<LexiconEntry>,
    @InjectRepository(MorphologyToken, 'bibleConnection')
    private readonly tokenRepository: Repository<MorphologyToken>,
  ) {}

  async getTokensByVerse(verseId: number): Promise<MorphologyToken[]> {
    return this.tokenRepository.find({
      where: { verse: { id: verseId } },
      order: { wordOrder: 'ASC' },
    });
  }

  async getLexiconEntry(strongCode: string): Promise<LexiconEntry> {
    const entry = await this.lexiconRepository.findOne({
      where: { strongCode },
    });
    if (!entry) {
      throw new EntityNotFoundError(
        `Entrada léxica Strong ${strongCode} no encontrada`,
      );
    }
    return entry;
  }

  async searchLexicon(query: string): Promise<LexiconEntry[]> {
    const cleanQuery = `%${query.trim().toLowerCase()}%`;
    return this.lexiconRepository
      .createQueryBuilder('lexicon')
      .where('LOWER(lexicon.strongCode) LIKE :query', { query: cleanQuery })
      .orWhere('LOWER(lexicon.lemma) LIKE :query', { query: cleanQuery })
      .orWhere('LOWER(lexicon.transliteration) LIKE :query', {
        query: cleanQuery,
      })
      .orWhere('LOWER(lexicon.shortDefinition) LIKE :query', {
        query: cleanQuery,
      })
      .limit(30)
      .getMany();
  }
}
