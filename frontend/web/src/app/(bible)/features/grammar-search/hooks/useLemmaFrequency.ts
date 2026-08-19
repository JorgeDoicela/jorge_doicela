'use client';

import { useState, useMemo } from 'react';
import { LemmaCanonicalData } from '../types';
import { LEMMA_CANONICAL_DATASET } from '../data/morphology-database';

export type ScatterPlotScale = 'linear' | 'logarithmic';

export function useLemmaFrequency() {
  const [selectedLemmaId, setSelectedLemmaId] = useState<string>(
    LEMMA_CANONICAL_DATASET[0]?.id || '',
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scale, setScale] = useState<ScatterPlotScale>('linear');

  const availableLemmas = LEMMA_CANONICAL_DATASET;

  const filteredLemmasList = useMemo(() => {
    if (!searchQuery.trim()) return availableLemmas;
    const q = searchQuery.trim().toLowerCase();
    return availableLemmas.filter(
      (item) =>
        item.lemma.toLowerCase().includes(q) ||
        item.transliteration.toLowerCase().includes(q) ||
        item.strong.toLowerCase().includes(q) ||
        item.primaryGloss.toLowerCase().includes(q),
    );
  }, [availableLemmas, searchQuery]);

  const activeLemmaData: LemmaCanonicalData = useMemo(() => {
    const found = availableLemmas.find((item) => item.id === selectedLemmaId);
    return found || availableLemmas[0];
  }, [availableLemmas, selectedLemmaId]);

  return {
    selectedLemmaId,
    setSelectedLemmaId,
    searchQuery,
    setSearchQuery,
    scale,
    setScale,
    availableLemmas: filteredLemmasList,
    activeLemmaData,
  };
}
