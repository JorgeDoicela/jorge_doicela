'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useParallelVerses } from '../hooks/useParallelVerses';
import { ParallelColumn, ParallelVerseRow } from '../types';
import { useBiblePassageSafe } from '../../../shared/context';

export interface ParallelPreset {
  id: string;
  name: string;
  description: string;
  translationIds: number[];
  badge: string;
}

export const PARALLEL_PRESETS: ParallelPreset[] = [
  {
    id: 'formal',
    name: 'Equivalencia Formal',
    description: 'Traducción literal y rigurosa palabra por palabra',
    translationIds: [3, 1], // NBLA (3), RV1909 (1)
    badge: 'Formal',
  },
  {
    id: 'dynamic',
    name: 'Equivalencia Dinámica',
    description: 'Claridad comunicativa y fluidez contemporánea',
    translationIds: [2, 7], // NVI (2), NTV (7 fallback o NIV)
    badge: 'Dinámica',
  },
  {
    id: 'originals',
    name: 'Textos Base Originales',
    description: 'Hebreo Masorético BHS y Septuaginta Griega LXX',
    translationIds: [4, 6], // BHS (4), LXX (6)
    badge: 'Manuscritos',
  },
  {
    id: 'comprehensive',
    name: 'Traducciones Panorámicas',
    description: 'Cotejo cuádruple simultáneo de alta precisión',
    translationIds: [3, 2, 1, 4], // NBLA, NVI, RV1909, BHS
    badge: '4 Versiones',
  },
];

export interface ParallelContextValue {
  columns: ParallelColumn[];
  rows: ParallelVerseRow[];
  loading: boolean;
  error: string | null;
  addColumn: (translationId: number) => void;
  removeColumn: (columnId: string) => void;
  updateColumnTranslation: (columnId: string, translationId: number) => void;
  setColumnTranslations: (translationIds: number[]) => void;
  refetch: () => Promise<void>;
  selectedVerseNumber: number;
  setSelectedVerseNumber: (verseNumber: number) => void;
  diffTransAId: number | null;
  diffTransBId: number | null;
  setDiffTransAId: (id: number | null) => void;
  setDiffTransBId: (id: number | null) => void;
  activePresetId: string | null;
  applyPreset: (presetId: string) => void;
  selectedRow: ParallelVerseRow | null;
}

const ParallelContext = createContext<ParallelContextValue | undefined>(undefined);

export const ParallelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const passageContext = useBiblePassageSafe();
  const bookId = passageContext?.selectedBookId ?? 1;
  const chapter = passageContext?.selectedChapter ?? 1;
  const selectedTransId = passageContext?.selectedTranslationId ?? 3;

  const defaultSecond = selectedTransId === 3 ? 5 : 3;
  const initialTrans = [selectedTransId, defaultSecond];

  const parallelState = useParallelVerses(bookId, chapter, initialTrans);

  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number>(1);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Inicializar traducciones de diff comparando las dos primeras columnas activas
  const [diffTransAId, setDiffTransAId] = useState<number | null>(null);
  const [diffTransBId, setDiffTransBId] = useState<number | null>(null);

  // Sincronizar diffTransAId y diffTransBId cuando cambian las columnas
  useEffect(() => {
    if (parallelState.columns.length >= 2) {
      setDiffTransAId((prev) => {
        const exists = parallelState.columns.some((c) => c.translationId === prev);
        return exists ? prev : parallelState.columns[0].translationId;
      });
      setDiffTransBId((prev) => {
        const exists = parallelState.columns.some((c) => c.translationId === prev);
        return exists ? prev : parallelState.columns[1].translationId;
      });
    }
  }, [parallelState.columns]);

  // Si cambia de libro o capítulo, resetear al versículo 1
  useEffect(() => {
    setSelectedVerseNumber(1);
  }, [bookId, chapter]);

  const applyPreset = (presetId: string) => {
    const preset = PARALLEL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(presetId);
    parallelState.setColumnTranslations(preset.translationIds);
    setDiffTransAId(preset.translationIds[0] ?? null);
    setDiffTransBId(preset.translationIds[1] ?? null);
  };

  const selectedRow = useMemo(() => {
    return parallelState.rows.find((r) => r.verseNumber === selectedVerseNumber) ?? parallelState.rows[0] ?? null;
  }, [parallelState.rows, selectedVerseNumber]);

  const value: ParallelContextValue = {
    ...parallelState,
    selectedVerseNumber,
    setSelectedVerseNumber,
    diffTransAId,
    diffTransBId,
    setDiffTransAId,
    setDiffTransBId,
    activePresetId,
    applyPreset,
    selectedRow,
  };

  return <ParallelContext.Provider value={value}>{children}</ParallelContext.Provider>;
};

export function useParallelContext(): ParallelContextValue {
  const context = useContext(ParallelContext);
  if (!context) {
    throw new Error('useParallelContext debe ser utilizado dentro de un ParallelProvider');
  }
  return context;
}

export function useParallelContextSafe(): ParallelContextValue | null {
  return useContext(ParallelContext) || null;
}
