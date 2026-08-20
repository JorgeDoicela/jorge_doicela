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

  async getTokensByPassage(
    bookAbbr: string,
    chapter: number,
  ): Promise<MorphologyToken[]> {
    return this.tokenRepository
      .createQueryBuilder('token')
      .innerJoinAndSelect('token.verse', 'verse')
      .innerJoinAndSelect('verse.book', 'book')
      .where('UPPER(book.abbreviation) = :bookAbbr', {
        bookAbbr: bookAbbr.toUpperCase(),
      })
      .andWhere('verse.chapter = :chapter', { chapter })
      .orderBy('verse.verseNumber', 'ASC')
      .addOrderBy('token.wordOrder', 'ASC')
      .getMany();
  }

  async searchTokens(filter: {
    query?: string;
    book?: string;
    strongCode?: string;
    morphologyCode?: string;
    limit?: number;
  }): Promise<MorphologyToken[]> {
    const qb = this.tokenRepository
      .createQueryBuilder('token')
      .innerJoinAndSelect('token.verse', 'verse')
      .innerJoinAndSelect('verse.book', 'book');

    if (filter.query && filter.query.trim() !== '') {
      const q = `%${filter.query.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(token.surfaceText) LIKE :q OR LOWER(token.gloss) LIKE :q OR LOWER(token.strongCode) LIKE :q)',
        { q },
      );
    }

    if (filter.book && filter.book.trim() !== '') {
      qb.andWhere('UPPER(book.abbreviation) = :book', {
        book: filter.book.toUpperCase(),
      });
    }

    if (filter.strongCode && filter.strongCode.trim() !== '') {
      qb.andWhere('UPPER(token.strongCode) = :strong', {
        strong: filter.strongCode.toUpperCase(),
      });
    }

    if (filter.morphologyCode && filter.morphologyCode.trim() !== '') {
      qb.andWhere('token.morphologyCode LIKE :morph', {
        morph: `%${filter.morphologyCode}%`,
      });
    }

    const limit = Math.min(Math.max(filter.limit || 50, 1), 100);
    return qb.limit(limit).getMany();
  }

  async getLexiconEntry(strongCode: string): Promise<LexiconEntry> {
    const entry = await this.lexiconRepository.findOne({
      where: { strongCode: strongCode.toUpperCase() },
    });
    if (!entry) {
      throw new EntityNotFoundError(
        `Entrada léxica Strong ${strongCode} no encontrada`,
      );
    }
    return entry;
  }

  async searchLexicon(
    query?: string,
    language?: string,
    limit: number = 30,
  ): Promise<LexiconEntry[]> {
    const qb = this.lexiconRepository.createQueryBuilder('lexicon');

    if (query && query.trim() !== '') {
      const cleanQuery = `%${query.trim().toLowerCase()}%`;
      qb.where('LOWER(lexicon.strongCode) LIKE :query', { query: cleanQuery })
        .orWhere('LOWER(lexicon.lemma) LIKE :query', { query: cleanQuery })
        .orWhere('LOWER(lexicon.transliteration) LIKE :query', {
          query: cleanQuery,
        })
        .orWhere('LOWER(lexicon.shortDefinition) LIKE :query', {
          query: cleanQuery,
        });
    }

    if (language && language !== 'all') {
      qb.andWhere('LOWER(lexicon.language) = :language', {
        language: language.toLowerCase(),
      });
    }

    const safeLimit = Math.min(Math.max(limit, 1), 100);
    return qb.limit(safeLimit).getMany();
  }
}
