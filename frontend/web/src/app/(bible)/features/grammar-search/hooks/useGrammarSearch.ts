'use client';

import { useState, useMemo } from 'react';
import {
  MorphologyFilterState,
  MorphologicalTokenResult,
  ExegeticalPreset,
} from '../types';
import { MORPHOLOGY_TOKENS, EXEGETICAL_PRESETS } from '../data/morphology-database';
import { CANONICAL_BOOKS } from '../data/canonical-books';

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

  const filteredResults = useMemo(() => {
    return MORPHOLOGY_TOKENS.filter((token) => {
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

      // 3. Filtro de Modo
      if (filters.mood !== 'all' && token.mood !== filters.mood) {
        return false;
      }

      // 4. Filtro de Tiempo / Binyan
      if (filters.tense !== 'all' && token.tense !== filters.tense) {
        return false;
      }

      // 5. Filtro de Voz
      if (filters.voice !== 'all' && token.voice !== filters.voice) {
        return false;
      }

      // 6. Filtro de Caso
      if (
        filters.grammaticalCase !== 'all' &&
        token.grammaticalCase !== filters.grammaticalCase
      ) {
        return false;
      }

      // 7. Filtro de Género
      if (filters.gender !== 'all' && token.gender !== filters.gender) {
        return false;
      }

      // 8. Filtro de Número
      if (filters.number !== 'all' && token.number !== filters.number) {
        return false;
      }

      // 9. Filtro de Persona
      if (filters.person !== 'all' && token.person !== filters.person) {
        return false;
      }

      // 10. Filtro de Alcance Canónico
      if (filters.scope === 'custom_books') {
        if (
          filters.customBookAbbrs.length > 0 &&
          !filters.customBookAbbrs.includes(token.bookAbbr)
        ) {
          return false;
        }
      } else if (filters.scope !== 'all') {
        const bookInfo = CANONICAL_BOOKS.find((b) => b.abbr === token.bookAbbr);
        if (!bookInfo) return false;

        if (filters.scope === 'OT' && bookInfo.testament !== 'OT') return false;
        if (filters.scope === 'NT' && bookInfo.testament !== 'NT') return false;
        if (filters.scope === 'pentateuch' && bookInfo.category !== 'Pentateuco') return false;
        if (filters.scope === 'history' && bookInfo.category !== 'Históricos') return false;
        if (filters.scope === 'poetry' && bookInfo.category !== 'Poéticos') return false;
        if (
          filters.scope === 'prophets' &&
          bookInfo.category !== 'Profetas Mayores' &&
          bookInfo.category !== 'Profetas Menores'
        )
          return false;
        if (filters.scope === 'gospels' && bookInfo.category !== 'Evangelios') return false;
        if (filters.scope === 'pauline' && bookInfo.category !== 'Epístolas Paulinas')
          return false;
        if (
          filters.scope === 'general_epistles' &&
          bookInfo.category !== 'Epístolas Generales'
        )
          return false;
        if (filters.scope === 'revelation' && bookInfo.category !== 'Apocalipsis')
          return false;
      }

      // 11. Búsqueda de Texto en Lema, Glosa o Strong
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.trim().toLowerCase();
        const matchesLemma = token.lemma.toLowerCase().includes(query);
        const matchesGloss = token.gloss.toLowerCase().includes(query);
        const matchesStrong = token.strong.toLowerCase().includes(query);
        const matchesTranslit = token.transliteration.toLowerCase().includes(query);
        const matchesWord = token.wordOriginal.toLowerCase().includes(query);
        if (!matchesLemma && !matchesGloss && !matchesStrong && !matchesTranslit && !matchesWord) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  return {
    filters,
    presets: EXEGETICAL_PRESETS,
    activePresetId,
    results: filteredResults,
    updateFilter,
    applyPreset,
    resetFilters,
    toggleCustomBook,
  };
}
