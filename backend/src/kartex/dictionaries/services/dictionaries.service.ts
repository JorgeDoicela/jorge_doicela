import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BibleDictionaryEntity } from '../entities/bible-dictionary.entity';
import { BibleDictionaryEntryEntity } from '../entities/bible-dictionary-entry.entity';
import { SearchDictionaryEntriesDto } from '../dto/search-dictionary-entries.dto';
import { EntityNotFoundError } from '../../../common/domain/domain-errors';

function normalizeDictionaryId(id?: string): string | undefined {
  if (!id) return undefined;
  const trimmed = id.trim();
  if (!trimmed || trimmed === 'all') return undefined;
  return trimmed.replace(/-(es|en)$/i, '');
}

@Injectable()
export class DictionariesService {
  constructor(
    @InjectRepository(BibleDictionaryEntity, 'kartexConnection')
    private readonly dictionaryRepo: Repository<BibleDictionaryEntity>,

    @InjectRepository(BibleDictionaryEntryEntity, 'kartexConnection')
    private readonly entryRepo: Repository<BibleDictionaryEntryEntity>,
  ) {}

  /**
   * Obtiene todos los diccionarios disponibles filtrados por idioma
   */
  async findAllDictionaries(
    language: string = 'es',
  ): Promise<BibleDictionaryEntity[]> {
    const targetLang = language?.trim() || 'es';
    return this.dictionaryRepo.find({
      where: { language: targetLang },
      order: { entriesCount: 'DESC', year: 'DESC' },
    });
  }

  /**
   * Obtiene el perfil de un diccionario por ID o slug
   */
  async findDictionaryById(
    id: string,
    language: string = 'es',
  ): Promise<BibleDictionaryEntity> {
    const targetLang = language?.trim() || 'es';
    const cleanId = normalizeDictionaryId(id) || id.trim();
    const dict = await this.dictionaryRepo.findOne({
      where: [
        { id: cleanId, language: targetLang },
        { slug: cleanId, language: targetLang },
      ],
    });
    if (!dict) {
      throw new EntityNotFoundError('BibleDictionary', id);
    }
    return dict;
  }

  /**
   * Búsqueda paginada indexada de entradas de diccionario con soporte External Content FTS5
   */
  async searchEntries(dto: SearchDictionaryEntriesDto): Promise<{
    items: BibleDictionaryEntryEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, dto.page || 1);
    const limit = Math.min(100, Math.max(1, dto.limit || 20));
    const language = dto.lang?.trim() || 'es';
    const cleanDictionaryId = normalizeDictionaryId(dto.dictionaryId);

    const qb = this.entryRepo
      .createQueryBuilder('entry')
      .where('entry.language = :language', { language });

    if (cleanDictionaryId) {
      qb.andWhere('entry.dictionaryId = :dictionaryId', {
        dictionaryId: cleanDictionaryId,
      });
    }

    if (dto.letter && dto.letter !== 'all') {
      qb.andWhere('entry.letter = :letter', {
        letter: dto.letter.trim().toUpperCase(),
      });
    }

    if (dto.category && dto.category !== 'all') {
      qb.andWhere('entry.category = :category', {
        category: dto.category.trim(),
      });
    }

    const searchText = (dto.q || dto.term || '').trim();
    if (searchText) {
      const normalizedQuery = searchText
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

      const tokens = normalizedQuery
        .replace(/["*()^:;{}[\]\\/-]/g, ' ')
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const ftsQuery =
        tokens.length > 0 ? tokens.map((t) => `"${t}"*`).join(' AND ') : '';

      if (ftsQuery) {
        qb.andWhere(
          `entry.rowid IN (
            SELECT fts.rowid
            FROM bible_dictionary_entries_fts fts
            WHERE fts.language = :language AND bible_dictionary_entries_fts MATCH :ftsQuery
          )`,
          {
            language,
            ftsQuery,
          },
        );
      } else {
        qb.andWhere(
          '(entry.normalizedTerm LIKE :termQuery OR entry.term LIKE :rawQuery)',
          {
            termQuery: `%${normalizedQuery}%`,
            rawQuery: `%${searchText}%`,
          },
        );
      }
    }

    qb.orderBy('entry.normalizedTerm', 'ASC')
      .addOrderBy('entry.dictionaryId', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Obtiene una entrada específica por su ID primario
   */
  async findEntryById(
    id: string,
    language: string = 'es',
  ): Promise<BibleDictionaryEntryEntity> {
    const targetLang = language?.trim() || 'es';
    const cleanId = id.trim().replace(/-(es|en)$/i, '');
    const entry = await this.entryRepo.findOne({
      where: { id: cleanId, language: targetLang },
    });
    if (!entry) {
      throw new EntityNotFoundError('BibleDictionaryEntry', id);
    }
    return entry;
  }

  /**
   * Obtiene el listado de letras alfabéticas A-Z con conteo de términos para la obra y categoría activas
   */
  async getAvailableLetters(
    dictionaryId?: string,
    language: string = 'es',
    category?: string,
  ): Promise<{ letter: string; count: number }[]> {
    const targetLang = language?.trim() || 'es';
    const cleanDictId = normalizeDictionaryId(dictionaryId);

    const qb = this.entryRepo
      .createQueryBuilder('entry')
      .select('entry.letter', 'letter')
      .addSelect('COUNT(*)', 'count')
      .where('entry.language = :language', { language: targetLang });

    if (cleanDictId) {
      qb.andWhere('entry.dictionaryId = :dictionaryId', {
        dictionaryId: cleanDictId,
      });
    }

    if (category && category !== 'all') {
      qb.andWhere('entry.category = :category', { category: category.trim() });
    }

    qb.groupBy('entry.letter').orderBy('entry.letter', 'ASC');

    const results = await qb.getRawMany<{
      letter: string;
      count: string | number;
    }>();

    return results.map((r) => ({
      letter: r.letter,
      count: Number(r.count) || 0,
    }));
  }

  /**
   * Búsqueda transversal de un término en todos los diccionarios disponibles
   */
  async lookupTerm(
    term: string,
    language: string = 'es',
  ): Promise<BibleDictionaryEntryEntity[]> {
    const targetLang = language?.trim() || 'es';
    const normalized = term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    return this.entryRepo.find({
      where: [
        { normalizedTerm: normalized, language: targetLang },
        { term: term.trim(), language: targetLang },
      ],
      order: { normalizedTerm: 'ASC' },
    });
  }
}
