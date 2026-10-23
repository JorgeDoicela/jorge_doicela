'use client';

import { useState, useCallback, useEffect } from 'react';
import { VerseHighlightColor } from '../types';

const STORAGE_KEY = 'kartex_verse_highlights_mem';

export function getVerseHighlightKey(bookId: number, chapter: number, verseNumber: number): string {
  return `${bookId}_${chapter}_${verseNumber}`;
}

export function useVerseHighlights() {
  const [highlights, setHighlights] = useState<Record<string, VerseHighlightColor>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as Record<string, VerseHighlightColor>;
      }
    } catch {
      // Ignorar fallback si storage no está disponible
    }
    return {};
  });

  const setHighlight = useCallback(
    (bookId: number, chapter: number, verseNumber: number, color: VerseHighlightColor) => {
      const key = getVerseHighlightKey(bookId, chapter, verseNumber);
      setHighlights((prev) => {
        const next = { ...prev, [key]: color };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignorar fallback
        }
        return next;
      });
    },
    [],
  );

  const removeHighlight = useCallback((bookId: number, chapter: number, verseNumber: number) => {
    const key = getVerseHighlightKey(bookId, chapter, verseNumber);
    setHighlights((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignorar fallback
      }
      return next;
    });
  }, []);

  const getHighlight = useCallback(
    (bookId: number, chapter: number, verseNumber: number): VerseHighlightColor | undefined => {
      const key = getVerseHighlightKey(bookId, chapter, verseNumber);
      return highlights[key];
    },
    [highlights],
  );

  const clearHighlights = useCallback(() => {
    setHighlights({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar fallback
    }
  }, []);

  return {
    highlights,
    setHighlight,
    removeHighlight,
    getHighlight,
    clearHighlights,
  };
}
