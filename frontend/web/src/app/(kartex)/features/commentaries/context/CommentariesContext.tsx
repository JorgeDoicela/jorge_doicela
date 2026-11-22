'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  CommentaryAuthor,
  CommentaryBookCoverage,
  CommentaryEntry,
  CommentarySearchScope,
} from '../types';
import {
  fetchCommentaryAuthors,
  fetchCommentaries,
  fetchCommentariesCoverage,
} from '../services/commentariesApiService';
import { useKartexPassageSafe } from '../../../entities/passage';
import { BOOK_ID_TO_ABBR } from '../../../entities/passage/data/crossReferencesData';

interface CommentariesContextValue {
  authors: CommentaryAuthor[];
  selectedAuthorId: string;
  setSelectedAuthorId: (id: string) => void;
  selectedEntryId: string | null;
  setSelectedEntryId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchScope: CommentarySearchScope;
  setSearchScope: (scope: CommentarySearchScope) => void;
  entries: CommentaryEntry[];
  coverage: CommentaryBookCoverage[];
  coverageByBookId: Record<string, CommentaryBookCoverage>;
  isLoading: boolean;
  refreshCommentaries: () => void;
  activeAuthor?: CommentaryAuthor;
  activeEntry?: CommentaryEntry;
}

const CommentariesContext = createContext<CommentariesContextValue | null>(null);

export function CommentariesProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const passageContext = useKartexPassageSafe();
  const searchParams = useSearchParams();
  const authorParam = searchParams?.get('author');
  const verseParam = searchParams?.get('verse');

  const [authors, setAuthors] = useState<CommentaryAuthor[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(() => authorParam || 'all');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchScope, setSearchScope] = useState<CommentarySearchScope>('all');
  const [entries, setEntries] = useState<CommentaryEntry[]>([]);
  const [coverage, setCoverage] = useState<CommentaryBookCoverage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const entriesAbortRef = useRef<AbortController | null>(null);

  // Sincronizar reactivamente si cambia el autor en los query params
  useEffect(() => {
    if (authorParam && authorParam !== selectedAuthorId) {
      setSelectedAuthorId(authorParam);
    }
  }, [authorParam, selectedAuthorId]);

  // Obtener abreviatura canónica del libro actual (ej. 'GEN', 'JUA')
  const currentBookAbbr = useMemo(() => {
    if (passageContext?.selectedBook?.abbreviation) {
      return passageContext.selectedBook.abbreviation;
    }
    if (!passageContext?.selectedBookId) return undefined;
    return BOOK_ID_TO_ABBR[passageContext.selectedBookId] || undefined;
  }, [passageContext?.selectedBook?.abbreviation, passageContext?.selectedBookId]);

  const currentChapter = passageContext?.selectedChapter;

  // Cargar catálogo de autores con cancelación limpia
  useEffect(() => {
    const controller = new AbortController();
    fetchCommentaryAuthors(locale, controller.signal).then((data) => {
      if (!controller.signal.aborted) {
        setAuthors(data);
      }
    });
    return () => {
      controller.abort();
    };
  }, [locale]);

  // Cargar mapa de cobertura por libro y capítulos para el autor e idioma activos
  useEffect(() => {
    const controller = new AbortController();
    fetchCommentariesCoverage(selectedAuthorId, locale, controller.signal).then((data) => {
      if (!controller.signal.aborted) {
        setCoverage(data);
      }
    });
    return () => {
      controller.abort();
    };
  }, [selectedAuthorId, locale]);

  const coverageByBookId = useMemo(() => {
    const map: Record<string, CommentaryBookCoverage> = {};
    for (const item of coverage) {
      map[item.bookId] = item;
    }
    return map;
  }, [coverage]);

  // Cargar comentarios filtrados con AbortController para evitar race conditions
  const loadEntries = useCallback(async () => {
    if (entriesAbortRef.current) {
      entriesAbortRef.current.abort();
    }
    const controller = new AbortController();
    entriesAbortRef.current = controller;

    setIsLoading(true);
    try {
      const hasSearchQuery = searchQuery.trim().length > 0;
      const isGlobalSearch = hasSearchQuery && searchScope === 'all';
      const parsedVerse = verseParam ? parseInt(verseParam, 10) : undefined;

      const data = await fetchCommentaries(
        {
          bookId: isGlobalSearch ? undefined : currentBookAbbr,
          chapter: isGlobalSearch ? undefined : currentChapter,
          verse:
            !isGlobalSearch && !isNaN(Number(parsedVerse)) ? parsedVerse : undefined,
          authorId: selectedAuthorId,
          q: hasSearchQuery ? searchQuery : undefined,
          lang: locale,
          limit: isGlobalSearch ? 80 : 100,
        },
        controller.signal,
      );

      if (controller.signal.aborted) return;

      setEntries(data);
      setSelectedEntryId((prev) => {
        if (data.length === 0) return null;
        const stillExists = prev && data.some((e) => e.id === prev);
        return stillExists ? prev : data[0].id;
      });
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [
    currentBookAbbr,
    currentChapter,
    selectedAuthorId,
    searchQuery,
    searchScope,
    locale,
    verseParam,
  ]);

  // Debounce de 150ms para amortiguar entradas de búsqueda y sincronizar consultas
  useEffect(() => {
    const timer = setTimeout(() => {
      loadEntries();
    }, 150);
    return () => {
      clearTimeout(timer);
    };
  }, [loadEntries]);

  useEffect(() => {
    return () => {
      entriesAbortRef.current?.abort();
    };
  }, []);

  const activeAuthor = useMemo(() => {
    if (selectedAuthorId === 'all') return authors[0];
    return authors.find((a) => a.id === selectedAuthorId);
  }, [authors, selectedAuthorId]);

  const activeEntry = useMemo(() => {
    if (!selectedEntryId) return entries[0];
    return entries.find((e) => e.id === selectedEntryId) || entries[0];
  }, [entries, selectedEntryId]);

  const handleSelectAuthorId = useCallback((id: string) => {
    setSelectedAuthorId(id);
    setSelectedEntryId(null);
  }, []);

  const value = useMemo(
    () => ({
      authors,
      selectedAuthorId,
      setSelectedAuthorId: handleSelectAuthorId,
      selectedEntryId,
      setSelectedEntryId,
      searchQuery,
      setSearchQuery,
      searchScope,
      setSearchScope,
      entries,
      coverage,
      coverageByBookId,
      isLoading,
      refreshCommentaries: loadEntries,
      activeAuthor,
      activeEntry,
    }),
    [
      authors,
      selectedAuthorId,
      handleSelectAuthorId,
      selectedEntryId,
      searchQuery,
      searchScope,
      entries,
      coverage,
      coverageByBookId,
      isLoading,
      loadEntries,
      activeAuthor,
      activeEntry,
    ],
  );

  return (
    <CommentariesContext.Provider value={value}>
      {children}
    </CommentariesContext.Provider>
  );
}

export function useCommentaries() {
  const ctx = useContext(CommentariesContext);
  if (!ctx) {
    throw new Error('useCommentaries debe usarse dentro de un CommentariesProvider');
  }
  return ctx;
}
