'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  MorphologyFilterState,
  MorphologicalTokenResult,
  ExegeticalPreset,
} from '../types';
import { MORPHOLOGY_TOKENS, EXEGETICAL_PRESETS } from '../data/morphology-database';
import { searchGrammarTokens } from '../services/grammarSearchApiService';

const DEFAULT_FILTER_STATE: MorphologyFilterState = {
  language: 'all',
  partOfSpeech: 'all',
  mood: 'all',
  tense: 'all',
  voice: 'all',
  grammaticalCase: 'all',
  gender: 'all',
  number: 'all',
  person: 'all',
  scope: 'all',
  customBookAbbrs: [],
  searchQuery: '',
};

export function useGrammarSearch() {
  const [filters, setFilters] = useState<MorphologyFilterState>(DEFAULT_FILTER_STATE);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [serverTokens, setServerTokens] = useState<MorphologicalTokenResult[]>(MORPHOLOGY_TOKENS);
  const [loading, setLoading] = useState(false);

  const updateFilter = <K extends keyof MorphologyFilterState>(
    key: K,
    value: MorphologyFilterState[K],
  ) => {
    setActivePresetId(null);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: ExegeticalPreset) => {
    setActivePresetId(preset.id);
    setFilters({
      ...DEFAULT_FILTER_STATE,
      ...preset.filter,
    });
  };

  const resetFilters = () => {
    setActivePresetId(null);
    setFilters(DEFAULT_FILTER_STATE);
  };

  const toggleCustomBook = (abbr: string) => {
    setActivePresetId(null);
    setFilters((prev) => {
      const exists = prev.customBookAbbrs.includes(abbr);
      const updated = exists
        ? prev.customBookAbbrs.filter((b) => b !== abbr)
        : [...prev.customBookAbbrs, abbr];
      return {
        ...prev,
        scope: 'custom_books',
        customBookAbbrs: updated,
      };
    });
  };

  useEffect(() => {
    let active = true;
    const fetchApiTokens = async () => {
      setLoading(true);
      try {
        const results = await searchGrammarTokens({
          query: filters.searchQuery || undefined,
          book: filters.customBookAbbrs.length > 0 ? filters.customBookAbbrs[0] : undefined,
          limit: 50,
        });
        if (active && results.length > 0) {
          setServerTokens(results);
        }
      } catch {
        // Fallback silencioso a MORPHOLOGY_TOKENS
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchApiTokens();
    return () => {
      active = false;
    };
  }, [filters.searchQuery, filters.customBookAbbrs]);

  const filteredResults = useMemo(() => {
    const sourceTokens = serverTokens.length > 0 ? serverTokens : MORPHOLOGY_TOKENS;
    return sourceTokens.filter((token) => {
      // 1. Filtro de Idioma
      if (filters.language === 'greek' && token.language !== 'Griego') return false;
      if (
        filters.language === 'hebrew_aramaic' &&
        token.language !== 'Hebreo' &&
        token.language !== 'Arameo'
      )
        return false;

      // 2. Filtro de Categoría Gramatical (POS)
      if (filters.partOfSpeech !== 'all' && token.partOfSpeech !== filters.partOfSpeech) {
        return false;
      }

      // 3. Filtro de Búsqueda de Texto
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesWord = token.wordOriginal.toLowerCase().includes(query);
        const matchesTranslit = (token.transliteration || '').toLowerCase().includes(query);
        const matchesStrong = (token.strong || '').toLowerCase().includes(query);
        const matchesParsing = token.parsingSummary.toLowerCase().includes(query);

        if (!matchesWord && !matchesTranslit && !matchesStrong && !matchesParsing) {
          return false;
        }
      }

      return true;
    });
  }, [filters, serverTokens]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.language !== 'all') count++;
    if (filters.partOfSpeech !== 'all') count++;
    if (filters.mood !== 'all') count++;
    if (filters.tense !== 'all') count++;
    if (filters.voice !== 'all') count++;
    if (filters.grammaticalCase !== 'all') count++;
    if (filters.gender !== 'all') count++;
    if (filters.number !== 'all') count++;
    if (filters.person !== 'all') count++;
    if (filters.scope !== 'all') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  return {
    filters,
    presets: EXEGETICAL_PRESETS,
    activePresetId,
    results: filteredResults,
    totalCount: filteredResults.length,
    activeFiltersCount,
    loading,
    updateFilter,
    applyPreset,
    resetFilters,
    toggleCustomBook,
  };
}
