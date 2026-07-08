import { useState, useEffect, useCallback } from 'react';
import { Verse } from '../types';

export function useVerses() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedTranslationId, setSelectedTranslationId] = useState<number | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const fetchVerses = useCallback(async (bookId: number | null, translationId: number | null) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${apiUrl}/bible/verses`;
      const params = new URLSearchParams();
      
      if (bookId !== null) {
        params.append('bookId', bookId.toString());
      }
      if (translationId !== null) {
        params.append('translationId', translationId.toString());
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('No se pudieron cargar los versículos');
      }
      const data = await res.json();
      setVerses(data as Verse[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (active) {
        await fetchVerses(selectedBookId, selectedTranslationId);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [fetchVerses, selectedBookId, selectedTranslationId]);

  return {
    verses,
    loading,
    error,
    selectedBookId,
    setSelectedBookId,
    selectedTranslationId,
    setSelectedTranslationId,
    refetch: () => fetchVerses(selectedBookId, selectedTranslationId),
  };
}
