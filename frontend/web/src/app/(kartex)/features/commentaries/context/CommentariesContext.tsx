'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CommentaryAuthor, CommentaryEntry } from '../types';
import {
  fetchCommentaryAuthors,
  fetchCommentaries,
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
  entries: CommentaryEntry[];
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
  const [entries, setEntries] = useState<CommentaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Obtener abreviatura del libro actual del pasaje (ej. 'GEN', 'JHN')
  const currentBookAbbr = useMemo(() => {
    if (!passageContext?.selectedBookId) return undefined;
    return BOOK_ID_TO_ABBR[passageContext.selectedBookId] || undefined;
  }, [passageContext?.selectedBookId]);

  const currentChapter = passageContext?.selectedChapter;

  // Cargar catálogo de autores
  useEffect(() => {
    let isMounted = true;
    fetchCommentaryAuthors(locale).then((data) => {
      if (isMounted) {
        setAuthors(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [locale]);

  // Cargar comentarios filtrados
  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const parsedVerse = verseParam ? parseInt(verseParam, 10) : undefined;
      const data = await fetchCommentaries({
        bookId: currentBookAbbr,
        chapter: currentChapter,
        verse: !isNaN(Number(parsedVerse)) ? parsedVerse : undefined,
        authorId: selectedAuthorId,
        q: searchQuery,
        lang: locale,
      });
      setEntries(data);
      if (data.length > 0 && !selectedEntryId) {
        setSelectedEntryId(data[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentBookAbbr, currentChapter, selectedAuthorId, searchQuery, locale, selectedEntryId, verseParam]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const activeAuthor = useMemo(() => {
    if (selectedAuthorId === 'all') return authors[0];
    return authors.find((a) => a.id === selectedAuthorId);
  }, [authors, selectedAuthorId]);

  const activeEntry = useMemo(() => {
    if (!selectedEntryId) return entries[0];
    return entries.find((e) => e.id === selectedEntryId) || entries[0];
  }, [entries, selectedEntryId]);

  const value = useMemo(
    () => ({
      authors,
      selectedAuthorId,
      setSelectedAuthorId,
      selectedEntryId,
      setSelectedEntryId,
      searchQuery,
      setSearchQuery,
      entries,
      isLoading,
      refreshCommentaries: loadEntries,
      activeAuthor,
      activeEntry,
    }),
    [
      authors,
      selectedAuthorId,
      selectedEntryId,
      searchQuery,
      entries,
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
