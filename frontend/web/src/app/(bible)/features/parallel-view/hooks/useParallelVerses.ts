'use client';

import { useState, useEffect, useCallback } from 'react';
import { ParallelColumn, ParallelVerseRow, VerseTranslationData } from '../types';
import { API_URL } from '../../../../config';

interface RawVerseResponse {
  id: number;
  chapter: number;
  verseNumber: number;
  text: string;
  book: {
    id: number;
    name: string;
    abbreviation: string;
  };
  translation: {
    id: number;
    name: string;
    abbreviation: string;
    language: string;
  };
}

export function useParallelVerses(
  bookId: number | null,
  chapter: number | null = null,
  initialTranslationIds: number[] = [1, 2],
) {
  const [columns, setColumns] = useState<ParallelColumn[]>(() =>
    initialTranslationIds.map((tid, idx) => ({
      id: `col-${idx + 1}`,
      translationId: tid,
    })),
  );

  const [rows, setRows] = useState<ParallelVerseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addColumn = useCallback((translationId: number) => {
    setColumns((prev) => {
      if (prev.length >= 4) return prev;
      const newId = `col-${Date.now()}`;
      return [...prev, { id: newId, translationId }];
    });
  }, []);

  const removeColumn = useCallback((columnId: string) => {
    setColumns((prev) => {
      if (prev.length <= 2) return prev; // mínimo 2 columnas para comparación
      return prev.filter((col) => col.id !== columnId);
    });
  }, []);

  const updateColumnTranslation = useCallback((columnId: string, translationId: number) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, translationId } : col)),
    );
  }, []);

  const fetchAllColumns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Obtener todas las traducciones únicas activas
      const uniqueTranslationIds = Array.from(
        new Set(columns.map((c) => c.translationId)),
      );

      // 2. Ejecutar peticiones en paralelo para cada traducción
      const promises = uniqueTranslationIds.map(async (tId) => {
        const params = new URLSearchParams();
        if (bookId !== null) params.append('bookId', bookId.toString());
        if (chapter !== null) params.append('chapter', chapter.toString());
        params.append('translationId', tId.toString());
        params.append('limit', '200');

        const requestUrl = `${API_URL}/bible/verses?${params.toString()}`;
        const res = await fetch(requestUrl);
        if (!res.ok) {
          throw new Error(`Error al obtener versículos para la traducción #${tId}`);
        }
        const json = await res.json();
        return {
          translationId: tId,
          verses: (json.data || []) as RawVerseResponse[],
        };
      });

      const results = await Promise.all(promises);

      // 3. Crear mapa: translationId -> (verseNumber -> VerseTranslationData)
      const versesByTranslation: Record<number, Record<number, VerseTranslationData>> = {};
      const allVerseNumbers = new Set<number>();

      for (const res of results) {
        versesByTranslation[res.translationId] = {};
        for (const v of res.verses) {
          allVerseNumbers.add(v.verseNumber);
          versesByTranslation[res.translationId][v.verseNumber] = {
            verseId: v.id,
            text: v.text,
            bookName: v.book.name,
            bookAbbreviation: v.book.abbreviation,
            chapter: v.chapter,
            verseNumber: v.verseNumber,
            translationId: v.translation.id,
            translationName: v.translation.name,
            translationAbbreviation: v.translation.abbreviation,
          };
        }
      }

      // 4. Construir las filas agrupadas y ordenadas por número de versículo
      const sortedVerseNumbers = Array.from(allVerseNumbers).sort((a, b) => a - b);
      const generatedRows: ParallelVerseRow[] = sortedVerseNumbers.map((vNum) => {
        const translationsMap: Record<number, VerseTranslationData | null> = {};
        for (const col of columns) {
          translationsMap[col.translationId] =
            versesByTranslation[col.translationId]?.[vNum] || null;
        }
        return {
          verseNumber: vNum,
          translations: translationsMap,
        };
      });

      setRows(generatedRows);
    } catch (err: unknown) {
      console.error('[Bible:useParallelVerses] Error durante fetchAllColumns:', err);
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [columns, bookId, chapter]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (active) {
        await fetchAllColumns();
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [fetchAllColumns]);

  return {
    columns,
    rows,
    loading,
    error,
    addColumn,
    removeColumn,
    updateColumnTranslation,
    refetch: fetchAllColumns,
  };
}
