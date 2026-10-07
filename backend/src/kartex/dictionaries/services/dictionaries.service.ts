import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BibleDictionaryEntity } from '../entities/bible-dictionary.entity';
import { BibleDictionaryEntryEntity } from '../entities/bible-dictionary-entry.entity';
import { SearchDictionaryEntriesDto } from '../dto/search-dictionary-entries.dto';
import { EntityNotFoundError } from '../../../common/domain/domain-errors';

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
    return this.dictionaryRepo.find({
      where: { language },
      order: { year: 'ASC' },
    });
  }

  /**
   * Obtiene el perfil de un diccionario por ID o slug
   */
  async findDictionaryById(
    id: string,
    language: string = 'es',
  ): Promise<BibleDictionaryEntity> {
    const dict = await this.dictionaryRepo.findOne({
      where: [
        { id, language },
        { slug: id, language },
      ],
    });
    if (!dict) {
      throw new EntityNotFoundError('BibleDictionary', id);
    }
    return dict;
  }

  /**
   * Búsqueda paginada indexada de entradas de diccionario con filtros por término, letra, categoría y obra
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
    const language = dto.lang || 'es';

    const qb = this.entryRepo
      .createQueryBuilder('entry')
      .where('entry.language = :language', { language });

    if (dto.dictionaryId && dto.dictionaryId !== 'all') {
      qb.andWhere('entry.dictionaryId = :dictionaryId', {
        dictionaryId: dto.dictionaryId,
      });
    }

    if (dto.letter && dto.letter !== 'all') {
      qb.andWhere('entry.letter = :letter', {
        letter: dto.letter.toUpperCase(),
      });
    }

    if (dto.category && dto.category !== 'all') {
      qb.andWhere('entry.category = :category', { category: dto.category });
    }

    const searchText = (dto.q || dto.term || '').trim();
    if (searchText) {
      const normalizedQuery = searchText
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

      qb.andWhere(
        '(entry.normalizedTerm LIKE :termQuery OR entry.term LIKE :rawQuery)',
        {
          termQuery: `%${normalizedQuery}%`,
          rawQuery: `%${searchText}%`,
        },
      );
    }

    qb.orderBy('entry.term', 'ASC')
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
    const entry = await this.entryRepo.findOne({
      where: { id, language },
    });
    if (!entry) {
      throw new EntityNotFoundError('BibleDictionaryEntry', id);
    }
    return entry;
  }

  /**
   * Obtiene el listado de letras alfabéticas A-Z con conteo de términos para la obra seleccionada
   */
  async getAvailableLetters(
    dictionaryId?: string,
    language: string = 'es',
  ): Promise<{ letter: string; count: number }[]> {
    const qb = this.entryRepo
      .createQueryBuilder('entry')
      .select('entry.letter', 'letter')
      .addSelect('COUNT(*)', 'count')
      .where('entry.language = :language', { language });

    if (dictionaryId && dictionaryId !== 'all') {
      qb.andWhere('entry.dictionaryId = :dictionaryId', { dictionaryId });
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
    const normalized = term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    return this.entryRepo.find({
      where: [
        { normalizedTerm: normalized, language },
        { term, language },
      ],
      order: { term: 'ASC' },
    });
  }
}
