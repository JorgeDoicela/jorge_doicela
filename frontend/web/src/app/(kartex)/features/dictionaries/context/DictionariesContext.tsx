'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocale } from 'next-intl';
import {
  BibleDictionary,
  BibleDictionaryEntry,
  DictionaryCategory,
  LetterCount,
} from '../types';
import {
  fetchDictionaries,
  searchDictionaryEntries,
  fetchAvailableLetters,
} from '../services/dictionariesApiService';

interface DictionariesContextType {
  dictionaries: BibleDictionary[];
  selectedDictionaryId: string;
  setSelectedDictionaryId: (id: string) => void;
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
  selectedCategory: DictionaryCategory;
  setSelectedCategory: (cat: DictionaryCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectRelatedTerm: (term: string) => void;
  entries: BibleDictionaryEntry[];
  selectedEntryId: string | null;
  setSelectedEntryId: (id: string | null) => void;
  activeEntry: BibleDictionaryEntry | null;
  activeDictionary: BibleDictionary | null;
  availableLetters: LetterCount[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalEntries: number;
  refreshEntries: () => Promise<void>;
}

const DictionariesContext = createContext<DictionariesContextType | null>(null);

export const DictionariesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const locale = useLocale();

  const [dictionaries, setDictionaries] = useState<BibleDictionary[]>([]);
  const [selectedDictionaryId, setSelectedDictionaryId] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<DictionaryCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [entries, setEntries] = useState<BibleDictionaryEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [availableLetters, setAvailableLetters] = useState<LetterCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalEntries, setTotalEntries] = useState<number>(0);

  const entriesAbortRef = useRef<AbortController | null>(null);

  // 1. Cargar catálogo de diccionarios al montar o cambiar de idioma
  useEffect(() => {
    const controller = new AbortController();
    fetchDictionaries(locale, controller.signal).then((data) => {
      if (!controller.signal.aborted) {
        setDictionaries(data);
      }
    });
    return () => {
      controller.abort();
    };
  }, [locale]);

  // 2. Cargar recuento de letras A-Z filtrado por diccionario y categoría
  useEffect(() => {
    const controller = new AbortController();
    fetchAvailableLetters(
      selectedDictionaryId,
      locale,
      selectedCategory,
      controller.signal,
    ).then((letters) => {
      if (!controller.signal.aborted) {
        setAvailableLetters(letters);
      }
    });
    return () => {
      controller.abort();
    };
  }, [selectedDictionaryId, selectedCategory, locale]);

  // 3. Cargar entradas según los filtros activos con AbortController y debounce
  const loadEntries = useCallback(async () => {
    if (entriesAbortRef.current) {
      entriesAbortRef.current.abort();
    }
    const controller = new AbortController();
    entriesAbortRef.current = controller;

    setIsLoading(true);
    try {
      const result = await searchDictionaryEntries(
        {
          dictionaryId: selectedDictionaryId,
          letter: selectedLetter,
          category: selectedCategory,
          q: searchQuery,
          page,
          limit: 25,
          lang: locale,
        },
        controller.signal,
      );

      if (controller.signal.aborted) return;

      setEntries(result.items);
      setTotalPages(result.totalPages);
      setTotalEntries(result.total);

      if (result.items.length > 0) {
        setSelectedEntryId((prev) => {
          if (prev && result.items.some((item) => item.id === prev)) {
            return prev;
          }
          return result.items[0]?.id || null;
        });
      } else {
        setSelectedEntryId(null);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [selectedDictionaryId, selectedLetter, selectedCategory, searchQuery, page, locale]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEntries();
    }, 150);
    return () => clearTimeout(timer);
  }, [loadEntries]);

  useEffect(() => {
    return () => {
      entriesAbortRef.current?.abort();
    };
  }, []);

  const selectRelatedTerm = useCallback((term: string) => {
    setSelectedLetter('all');
    setSelectedCategory('all');
    setSearchQuery(term);
    setPage(1);
  }, []);

  // Diccionario activo
  const activeDictionary = useMemo(() => {
    if (selectedDictionaryId === 'all') {
      return null;
    }
    return dictionaries.find((d) => d.id === selectedDictionaryId) || null;
  }, [dictionaries, selectedDictionaryId]);

  // Entrada activa
  const activeEntry = useMemo(() => {
    if (!selectedEntryId) {
      return entries[0] || null;
    }
    return entries.find((e) => e.id === selectedEntryId) || entries[0] || null;
  }, [entries, selectedEntryId]);

  const value = useMemo(
    () => ({
      dictionaries,
      selectedDictionaryId,
      setSelectedDictionaryId: (id: string) => {
        setSelectedDictionaryId(id);
        setSelectedEntryId(null);
        setPage(1);
      },
      selectedLetter,
      setSelectedLetter: (letter: string) => {
        setSelectedLetter(letter);
        setSelectedEntryId(null);
        setPage(1);
      },
      selectedCategory,
      setSelectedCategory: (cat: DictionaryCategory) => {
        setSelectedCategory(cat);
        setSelectedLetter('all');
        setSelectedEntryId(null);
        setPage(1);
      },
      searchQuery,
      setSearchQuery: (q: string) => {
        setSearchQuery(q);
        setPage(1);
      },
      selectRelatedTerm,
      entries,
      selectedEntryId,
      setSelectedEntryId,
      activeEntry,
      activeDictionary,
      availableLetters,
      isLoading,
      page,
      setPage,
      totalPages,
      totalEntries,
      refreshEntries: loadEntries,
    }),
    [
      dictionaries,
      selectedDictionaryId,
      selectedLetter,
      selectedCategory,
      searchQuery,
      selectRelatedTerm,
      entries,
      selectedEntryId,
      activeEntry,
      activeDictionary,
      availableLetters,
      isLoading,
      page,
      totalPages,
      totalEntries,
      loadEntries,
    ],
  );

  return (
    <DictionariesContext.Provider value={value}>
      {children}
    </DictionariesContext.Provider>
  );
};

export function useDictionaries(): DictionariesContextType {
  const context = useContext(DictionariesContext);
  if (!context) {
    throw new Error('useDictionaries debe ser utilizado dentro de un DictionariesProvider');
  }
  return context;
}
