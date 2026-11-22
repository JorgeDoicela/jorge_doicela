import { API_URL } from '../../../../config';
import {
  CommentaryAuthor,
  CommentaryBookCoverage,
  CommentaryEntry,
  CommentaryFilterParams,
} from '../types';

export async function fetchCommentaryAuthors(
  lang: string = 'es',
  signal?: AbortSignal,
): Promise<CommentaryAuthor[]> {
  try {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/kartex/commentaries/authors?${params.toString()}`, {
      signal,
    });
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function fetchCommentaryAuthorById(
  id: string,
  lang: string = 'es',
  signal?: AbortSignal,
): Promise<CommentaryAuthor | null> {
  try {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);

    const res = await fetch(
      `${API_URL}/kartex/commentaries/authors/${encodeURIComponent(id)}?${params.toString()}`,
      { signal },
    );
    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || json || null;
  } catch {
    return null;
  }
}

export async function fetchCommentariesCoverage(
  authorId?: string,
  lang: string = 'es',
  signal?: AbortSignal,
): Promise<CommentaryBookCoverage[]> {
  try {
    const params = new URLSearchParams();
    if (authorId && authorId !== 'all') params.append('authorId', authorId);
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/kartex/commentaries/coverage?${params.toString()}`, {
      signal,
    });
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function fetchCommentaries(
  filters: CommentaryFilterParams = {},
  signal?: AbortSignal,
): Promise<CommentaryEntry[]> {
  try {
    const params = new URLSearchParams();
    if (filters.bookId) params.append('bookId', filters.bookId);
    if (filters.chapter !== undefined && filters.chapter !== null) {
      params.append('chapter', filters.chapter.toString());
    }
    if (filters.verse !== undefined && filters.verse !== null) {
      params.append('verse', filters.verse.toString());
    }
    if (filters.authorId && filters.authorId !== 'all') {
      params.append('authorId', filters.authorId);
    }
    if (filters.entryType) {
      params.append('entryType', filters.entryType);
    }
    if (filters.q && filters.q.trim()) {
      params.append('q', filters.q.trim());
    }
    if (filters.lang) {
      params.append('lang', filters.lang);
    }
    if (filters.limit !== undefined && filters.limit !== null) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.offset !== undefined && filters.offset !== null) {
      params.append('offset', filters.offset.toString());
    }

    const res = await fetch(`${API_URL}/kartex/commentaries?${params.toString()}`, {
      signal,
    });
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function fetchCommentariesByPassage(
  bookId: string,
  chapter: number,
  verse?: number,
  lang: string = 'es',
  signal?: AbortSignal,
): Promise<CommentaryEntry[]> {
  try {
    const params = new URLSearchParams();
    if (verse !== undefined && verse !== null) {
      params.append('verse', verse.toString());
    }
    if (lang) {
      params.append('lang', lang);
    }

    const res = await fetch(
      `${API_URL}/kartex/commentaries/passage/${encodeURIComponent(bookId)}/${chapter}?${params.toString()}`,
      { signal },
    );
    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}
