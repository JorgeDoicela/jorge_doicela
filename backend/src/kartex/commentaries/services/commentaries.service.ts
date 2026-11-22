import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentaryAuthorEntity } from '../entities/commentary-author.entity';
import { CommentaryEntryEntity } from '../entities/commentary-entry.entity';
import {
  GetCommentariesQueryDto,
  GetCommentariesCoverageQueryDto,
} from '../dto/get-commentaries-query.dto';
import { EntityNotFoundError } from '../../../common/domain/domain-errors';
import { resolveCanonicalBook } from '../utils/book-code.util';

export interface CommentaryBookCoverage {
  bookId: string;
  bookOrder: number;
  entriesCount: number;
  chapters: number[];
}

@Injectable()
export class CommentariesService {
  constructor(
    @InjectRepository(CommentaryAuthorEntity, 'kartexConnection')
    private readonly authorsRepo: Repository<CommentaryAuthorEntity>,

    @InjectRepository(CommentaryEntryEntity, 'kartexConnection')
    private readonly entriesRepo: Repository<CommentaryEntryEntity>,
  ) {}

  async getAuthors(lang?: string): Promise<CommentaryAuthorEntity[]> {
    const targetLang = lang?.trim() || 'es';
    return this.authorsRepo.find({
      where: { language: targetLang },
      order: { entriesCount: 'DESC', id: 'DESC' },
    });
  }

  async getAuthorById(
    id: string,
    lang?: string,
  ): Promise<CommentaryAuthorEntity> {
    const targetLang = lang?.trim() || 'es';
    const author = await this.authorsRepo.findOne({
      where: { id, language: targetLang },
    });
    if (!author) {
      throw new EntityNotFoundError('CommentaryAuthor', id);
    }
    return author;
  }

  async getCoverage(
    query: GetCommentariesCoverageQueryDto,
  ): Promise<CommentaryBookCoverage[]> {
    const targetLang = query.lang?.trim() || 'es';
    const qb = this.entriesRepo
      .createQueryBuilder('entry')
      .select('entry.bookId', 'bookId')
      .addSelect('entry.bookOrder', 'bookOrder')
      .addSelect('entry.chapter', 'chapter')
      .addSelect('COUNT(*)', 'cnt')
      .where('entry.language = :lang', { lang: targetLang });

    if (query.authorId && query.authorId !== 'all') {
      qb.andWhere('entry.authorId = :authorId', { authorId: query.authorId });
    }

    qb.groupBy('entry.bookId')
      .addGroupBy('entry.bookOrder')
      .addGroupBy('entry.chapter')
      .orderBy('entry.bookOrder', 'ASC')
      .addOrderBy('entry.chapter', 'ASC');

    const rows = await qb.getRawMany<{
      bookId: string;
      bookOrder: number;
      chapter: number;
      cnt: string | number;
    }>();

    const map = new Map<string, CommentaryBookCoverage>();
    for (const row of rows) {
      const count = Number(row.cnt) || 0;
      const chapterNum = Number(row.chapter);
      const existing = map.get(row.bookId);
      if (existing) {
        existing.entriesCount += count;
        if (chapterNum > 0 && !existing.chapters.includes(chapterNum)) {
          existing.chapters.push(chapterNum);
        }
      } else {
        map.set(row.bookId, {
          bookId: row.bookId,
          bookOrder: Number(row.bookOrder) || 1,
          entriesCount: count,
          chapters: chapterNum > 0 ? [chapterNum] : [],
        });
      }
    }

    return Array.from(map.values());
  }

  async getCommentaries(
    query: GetCommentariesQueryDto,
  ): Promise<CommentaryEntryEntity[]> {
    const targetLang = query.lang?.trim() || 'es';
    const qb = this.entriesRepo.createQueryBuilder('entry');
    qb.where('entry.language = :lang', { lang: targetLang });

    if (query.bookId) {
      const resolved = resolveCanonicalBook(query.bookId);
      if (resolved) {
        qb.andWhere('entry.bookId = :bookId', { bookId: resolved.bookId });
      } else {
        qb.andWhere('entry.bookId = :bookId', {
          bookId: query.bookId.trim().toUpperCase(),
        });
      }
    }

    if (query.chapter !== undefined && query.chapter !== null) {
      qb.andWhere('entry.chapter = :chapter', { chapter: query.chapter });
    }

    if (query.verse !== undefined && query.verse !== null) {
      if (query.verse === 0) {
        qb.andWhere('entry.verseStart = 0');
      } else {
        qb.andWhere(
          'entry.verseStart > 0 AND entry.verseStart <= :verse AND (entry.verseEnd IS NULL OR entry.verseEnd >= :verse)',
          { verse: query.verse },
        );
      }
    }

    if (query.entryType) {
      qb.andWhere('entry.entryType = :entryType', {
        entryType: query.entryType,
      });
    }

    if (query.authorId && query.authorId !== 'all') {
      qb.andWhere('entry.authorId = :authorId', { authorId: query.authorId });
    }

    if (query.q && query.q.trim()) {
      const rawTerm = query.q.trim();
      const tokens = rawTerm
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
            FROM commentary_entries_fts fts
            WHERE fts.language = :lang AND commentary_entries_fts MATCH :ftsQuery
          )`,
          {
            lang: targetLang,
            ftsQuery,
          },
        );
      } else {
        qb.andWhere('(entry.title LIKE :q OR entry.contentMarkdown LIKE :q)', {
          q: `%${rawTerm}%`,
        });
      }
    }

    qb.orderBy('entry.bookOrder', 'ASC')
      .addOrderBy('entry.chapter', 'ASC')
      .addOrderBy('entry.verseStart', 'ASC')
      .addOrderBy('entry.authorId', 'ASC');

    const limit = Math.min(200, Math.max(1, query.limit || 60));
    qb.take(limit);

    if (query.offset && query.offset > 0) {
      qb.skip(query.offset);
    }

    return qb.getMany();
  }

  async getCommentariesByPassage(
    bookId: string,
    chapter: number,
    verse?: number,
    lang?: string,
    authorId?: string,
  ): Promise<CommentaryEntryEntity[]> {
    return this.getCommentaries({
      bookId,
      chapter,
      verse,
      lang,
      authorId,
    });
  }
}
