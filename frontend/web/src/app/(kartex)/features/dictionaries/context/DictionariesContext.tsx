'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

  // 1. Cargar catálogo de diccionarios al montar o cambiar de idioma
  useEffect(() => {
    let isMounted = true;
    fetchDictionaries(locale).then((data) => {
      if (isMounted) {
        setDictionaries(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [locale]);

  // 2. Cargar recuento de letras A-Z
  useEffect(() => {
    let isMounted = true;
    fetchAvailableLetters(selectedDictionaryId, locale).then((letters) => {
      if (isMounted) {
        setAvailableLetters(letters);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedDictionaryId, locale]);

  // 3. Cargar entradas según los filtros activos con debounce para búsqueda
  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    const result = await searchDictionaryEntries({
      dictionaryId: selectedDictionaryId,
      letter: selectedLetter,
      category: selectedCategory,
      q: searchQuery,
      page,
      limit: 25,
      lang: locale,
    });
    setEntries(result.items);
    setTotalPages(result.totalPages);
    setTotalEntries(result.total);
    setIsLoading(false);

    // Auto-seleccionar la primera entrada si no hay ninguna seleccionada
    if (result.items.length > 0 && !selectedEntryId) {
      setSelectedEntryId(result.items[0].id);
    }
  }, [selectedDictionaryId, selectedLetter, selectedCategory, searchQuery, page, locale, selectedEntryId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEntries();
    }, 150);
    return () => clearTimeout(timer);
  }, [loadEntries]);

  // Diccionario activo
  const activeDictionary = useMemo(() => {
    if (selectedDictionaryId === 'all') {
      return dictionaries[0] || null;
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
        setSelectedEntryId(null);
        setPage(1);
      },
      searchQuery,
      setSearchQuery: (q: string) => {
        setSearchQuery(q);
        setPage(1);
      },
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
