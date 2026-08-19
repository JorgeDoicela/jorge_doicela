import { useState, useEffect, useCallback } from 'react';
import {
  Verse,
  ReaderLayoutMode,
  ReaderFontSize,
  ReaderFontFamily,
  ReaderSettings,
} from '../types';
import { API_URL } from '../../../../config';
import { FALLBACK_GENESIS_1, FALLBACK_SALMOS_23 } from '../data/fallbackVerses';

export function useVerses() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Por defecto: Génesis (id: 1), Reina-Valera 1960 (id: 1), Capítulo 1
  const [selectedBookId, setSelectedBookId] = useState<number | null>(1);
  const [selectedTranslationId, setSelectedTranslationId] = useState<number | null>(1);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(1);

  // Configuraciones de visualización del lector
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>({
    layoutMode: 'continuous',
    fontSize: 'md',
    fontFamily: 'serif',
    showVerseNumbers: true,
  });

  // Cargar configuraciones guardadas en localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bible_reader_settings');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ReaderSettings>;
        setReaderSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignorar errores de parsing
    }
  }, []);

  const updateReaderSettings = useCallback((newSettings: Partial<ReaderSettings>) => {
    setReaderSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('bible_reader_settings', JSON.stringify(updated));
      } catch {
        // Fallback si localStorage no está disponible
      }
      return updated;
    });
  }, []);

  const setLayoutMode = useCallback(
    (layoutMode: ReaderLayoutMode) => updateReaderSettings({ layoutMode }),
    [updateReaderSettings],
  );

  const setFontSize = useCallback(
    (fontSize: ReaderFontSize) => updateReaderSettings({ fontSize }),
    [updateReaderSettings],
  );

  const setFontFamily = useCallback(
    (fontFamily: ReaderFontFamily) => updateReaderSettings({ fontFamily }),
    [updateReaderSettings],
  );

  const toggleVerseNumbers = useCallback(() => {
    setReaderSettings((prev) => {
      const updated = { ...prev, showVerseNumbers: !prev.showVerseNumbers };
      try {
        localStorage.setItem('bible_reader_settings', JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });
  }, []);

  const fetchVerses = useCallback(
    async (
      bookId: number | null,
      translationId: number | null,
      chapter: number | null,
    ) => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_URL}/bible/verses`;
        const params = new URLSearchParams();

        if (bookId !== null) {
          params.append('bookId', bookId.toString());
        }
        if (translationId !== null) {
          params.append('translationId', translationId.toString());
        }
        if (chapter !== null) {
          params.append('chapter', chapter.toString());
        }
        params.append('limit', '200');

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Servidor respondió con código ${res.status}: No se pudieron cargar los versículos`);
        }
        const data = await res.json();
        const serverVerses = (data.data as Verse[]) || [];

        if (serverVerses.length > 0) {
          setVerses(serverVerses);
        } else if (bookId === 1 && chapter === 1) {
          setVerses(FALLBACK_GENESIS_1);
        } else if (bookId === 19 && chapter === 23) {
          setVerses(FALLBACK_SALMOS_23);
        } else {
          setVerses([]);
        }
      } catch (err: unknown) {
        console.error('[Bible:useVerses] Error al conectar con el servidor:', err);
        // En caso de fallo de red o servidor, usar fallback canónico si aplica
        if (bookId === 1 && chapter === 1) {
          setVerses(FALLBACK_GENESIS_1);
        } else if (bookId === 19 && chapter === 23) {
          setVerses(FALLBACK_SALMOS_23);
        } else {
          setVerses([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Al cambiar de libro, seleccionar el capítulo 1 por defecto
  const handleSelectBook = useCallback((id: number | null) => {
    setSelectedBookId(id);
    setSelectedChapter(id !== null ? 1 : null);
  }, []);

  const nextChapter = useCallback((maxChapters: number = 150) => {
    setSelectedChapter((prev) => {
      if (prev === null) return 1;
      return prev < maxChapters ? prev + 1 : prev;
    });
  }, []);

  const prevChapter = useCallback(() => {
    setSelectedChapter((prev) => {
      if (prev === null || prev <= 1) return 1;
      return prev - 1;
    });
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (active) {
        await fetchVerses(selectedBookId, selectedTranslationId, selectedChapter);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [fetchVerses, selectedBookId, selectedTranslationId, selectedChapter]);

  return {
    verses,
    loading,
    error,
    selectedBookId,
    setSelectedBookId: handleSelectBook,
    selectedTranslationId,
    setSelectedTranslationId,
    selectedChapter,
    setSelectedChapter,
    readerSettings,
    setLayoutMode,
    setFontSize,
    setFontFamily,
    toggleVerseNumbers,
    nextChapter,
    prevChapter,
    refetch: () => fetchVerses(selectedBookId, selectedTranslationId, selectedChapter),
  };
}
