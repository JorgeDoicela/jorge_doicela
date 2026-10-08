import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentaryAuthorEntity } from '../entities/commentary-author.entity';
import { CommentaryEntryEntity } from '../entities/commentary-entry.entity';
import { GetCommentariesQueryDto } from '../dto/get-commentaries-query.dto';
import { EntityNotFoundError } from '../../../common/domain/domain-errors';

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
      order: { id: 'ASC' },
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

  async getCommentaries(
    query: GetCommentariesQueryDto,
  ): Promise<CommentaryEntryEntity[]> {
    const targetLang = query.lang?.trim() || 'es';
    const qb = this.entriesRepo.createQueryBuilder('entry');
    qb.where('entry.language = :lang', { lang: targetLang });

    if (query.bookId) {
      qb.andWhere('entry.bookId = :bookId', {
        bookId: query.bookId.toUpperCase(),
      });
    }

    if (query.chapter !== undefined && query.chapter !== null) {
      qb.andWhere('entry.chapter = :chapter', { chapter: query.chapter });
    }

    if (query.verse !== undefined && query.verse !== null) {
      qb.andWhere(
        'entry.verseStart <= :verse AND (entry.verseEnd IS NULL OR entry.verseEnd >= :verse)',
        { verse: query.verse },
      );
    }

    if (query.authorId && query.authorId !== 'all') {
      qb.andWhere('entry.authorId = :authorId', { authorId: query.authorId });
    }

    if (query.q && query.q.trim()) {
      const rawTerm = query.q.trim();
      const cleanFtsTerm = rawTerm
        .replace(/["*()^:;{}[\]\\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const ftsQuery = cleanFtsTerm ? `"${cleanFtsTerm}"*` : '';

      if (ftsQuery) {
        qb.andWhere(
          `((entry.id, entry.language) IN (
              SELECT fts.id, fts.language 
              FROM commentary_entries_fts fts 
              WHERE fts.language = :lang AND commentary_entries_fts MATCH :ftsQuery
           ) OR entry.title LIKE :q OR entry.contentMarkdown LIKE :q)`,
          {
            lang: targetLang,
            ftsQuery,
            q: `%${rawTerm}%`,
          },
        );
      } else {
        qb.andWhere('(entry.title LIKE :q OR entry.contentMarkdown LIKE :q)', {
          q: `%${rawTerm}%`,
        });
      }
    }

    qb.orderBy('entry.bookId', 'ASC')
      .addOrderBy('entry.chapter', 'ASC')
      .addOrderBy('entry.verseStart', 'ASC');

    const limit = Math.min(100, Math.max(1, query.limit || 50));
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
  ): Promise<CommentaryEntryEntity[]> {
    return this.getCommentaries({
      bookId,
      chapter,
      verse,
      lang,
    });
  }
}
