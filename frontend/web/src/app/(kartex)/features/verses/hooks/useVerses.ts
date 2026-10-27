import { useState, useEffect, useCallback } from 'react';
import {
  Verse,
  Pericope,
  ReaderLayoutMode,
  ReaderFontSize,
  ReaderFontFamily,
  ReaderSettings,
} from '../types';
import { DEFAULT_READER_FONT_ID, isValidReaderFont } from '../config/readerFonts';
import { API_URL } from '../../../../config';
import { resolveInitialTranslationId, FALLBACK_DEFAULT_TRANSLATION_ID } from '../../../entities/translations';
import { fetchPericopes } from '../services/pericopesApiService';

// Caché en memoria a nivel de módulo para navegación con latencia cero (0 ms)
const verseCache = new Map<string, Verse[]>();
const pericopeCache = new Map<string, Pericope[]>();

function getVerseCacheKey(
  bookId: number | null,
  chapter: number | null,
  translationId: number | null,
): string {
  return `${bookId ?? 1}_${chapter ?? 1}_${translationId ?? 3}`;
}

function getPericopeCacheKey(bookId: number | null, chapter: number | null): string {
  return `${bookId ?? 1}_${chapter ?? 1}`;
}

export function useVerses(
  externalBookId?: number | null,
  externalChapter?: number | null,
  externalTranslationId?: number | null,
) {
  // Estado interno de fallback solo si no se proveen props externas
  const [internalBookId, setInternalBookId] = useState<number | null>(1);
  const [internalChapter, setInternalChapter] = useState<number | null>(1);
  const [internalTranslationId, setInternalTranslationId] = useState<number | null>(() =>
    resolveInitialTranslationId(),
  );

  const effectiveBookId = externalBookId !== undefined ? externalBookId : internalBookId;
  const effectiveChapter = externalChapter !== undefined ? externalChapter : internalChapter;
  const effectiveTranslationId =
    externalTranslationId !== undefined ? externalTranslationId : internalTranslationId;

  const cacheKey = getVerseCacheKey(effectiveBookId, effectiveChapter, effectiveTranslationId);
  const pCacheKey = getPericopeCacheKey(effectiveBookId, effectiveChapter);

  const [verses, setVerses] = useState<Verse[]>(() => {
    return verseCache.get(cacheKey) || [];
  });
  const [pericopes, setPericopes] = useState<Pericope[]>(() => {
    return pericopeCache.get(pCacheKey) || [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    return !verseCache.has(cacheKey);
  });
  const [error, setError] = useState<string | null>(null);
  const [loadedKey, setLoadedKey] = useState<string>(cacheKey);

  // Sincronización atómica durante el render (elimina cualquier desfase o mezcla entre capítulos)
  if (cacheKey !== loadedKey) {
    setLoadedKey(cacheKey);
    const cachedVerses = verseCache.get(cacheKey);
    const cachedPericopes = pericopeCache.get(pCacheKey);

    if (cachedVerses && cachedPericopes) {
      setVerses(cachedVerses);
      setPericopes(cachedPericopes);
      setLoading(false);
      setError(null);
    } else if (cachedVerses) {
      setVerses(cachedVerses);
      setPericopes([]);
      setLoading(false);
      setError(null);
    } else {
      // Limpiar datos del capítulo previo mientras se cargan los nuevos
      setVerses([]);
      setPericopes(cachedPericopes || []);
      setLoading(true);
      setError(null);
    }
  }

  // Configuraciones de visualización del lector
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>({
    layoutMode: 'continuous',
    fontSize: 'md',
    fontFamily: DEFAULT_READER_FONT_ID,
    showVerseNumbers: true,
    showPericopes: true,
    focusMode: false,
  });

  // Cargar y sincronizar configuraciones guardadas en localStorage
  useEffect(() => {
    const syncSettings = () => {
      try {
        const saved = localStorage.getItem('kartex_reader_settings');
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<ReaderSettings>;
          if (parsed.fontFamily && !isValidReaderFont(parsed.fontFamily)) {
            parsed.fontFamily = DEFAULT_READER_FONT_ID;
          }
          setReaderSettings((prev) => ({
            ...prev,
            ...parsed,
            focusMode: prev.focusMode,
          }));
        }
      } catch {
        // Ignorar errores de parsing
      }
    };

    syncSettings();
    window.addEventListener('kartex_reader_settings_changed', syncSettings);
    window.addEventListener('storage', syncSettings);
    return () => {
      window.removeEventListener('kartex_reader_settings_changed', syncSettings);
      window.removeEventListener('storage', syncSettings);
    };
  }, []);

  const updateReaderSettings = useCallback((newSettings: Partial<ReaderSettings>) => {
    try {
      const saved = localStorage.getItem('kartex_reader_settings');
      const current = saved ? JSON.parse(saved) : {};
      const updated = { ...current, ...newSettings };
      localStorage.setItem(
        'kartex_reader_settings',
        JSON.stringify({
          layoutMode: updated.layoutMode,
          fontSize: updated.fontSize,
          fontFamily: updated.fontFamily,
          showVerseNumbers: updated.showVerseNumbers,
          showPericopes: updated.showPericopes,
        }),
      );
    } catch {
      // Fallback
    }

    setReaderSettings((prev) => ({ ...prev, ...newSettings }));

    if (typeof window !== 'undefined') {
      queueMicrotask(() => {
        window.dispatchEvent(new Event('kartex_reader_settings_changed'));
      });
    }
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

  const toggleFocusMode = useCallback(() => {
    setReaderSettings((prev) => ({ ...prev, focusMode: !prev.focusMode }));
  }, []);

  const setFocusMode = useCallback((focusMode: boolean) => {
    setReaderSettings((prev) => ({ ...prev, focusMode }));
  }, []);

  const toggleVerseNumbers = useCallback(() => {
    updateReaderSettings({ showVerseNumbers: !readerSettings.showVerseNumbers });
  }, [updateReaderSettings, readerSettings.showVerseNumbers]);

  const togglePericopes = useCallback(() => {
    updateReaderSettings({ showPericopes: !readerSettings.showPericopes });
  }, [updateReaderSettings, readerSettings.showPericopes]);

  // Función atómica de consulta a la API con persistencia en caché
  const fetchVersesData = useCallback(
    async (bId: number | null, ch: number | null, transId: number | null): Promise<Verse[]> => {
      let url = `${API_URL}/kartex/verses`;
      const params = new URLSearchParams();

      if (bId !== null) params.append('bookId', bId.toString());
      if (transId !== null) params.append('translationId', transId.toString());
      if (ch !== null) params.append('chapter', ch.toString());
      params.append('limit', '200');

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Servidor respondió con código ${res.status}: No se pudieron cargar los versículos`);
      }
      const data = await res.json();
      return (data.data as Verse[]) || [];
    },
    [],
  );

  // Pre-fetching proactivo en segundo plano de capítulos adyacentes (versículos y perícopas canónicas)
  const prefetchAdjacentChapters = useCallback(
    (bId: number | null, ch: number | null, transId: number | null) => {
      if (!ch || !bId || typeof window === 'undefined') return;

      const schedulePrefetch = (chapterToFetch: number) => {
        const nextKey = getVerseCacheKey(bId, chapterToFetch, transId);
        const nextPKey = getPericopeCacheKey(bId, chapterToFetch);

        if (verseCache.has(nextKey) && pericopeCache.has(nextPKey)) return;

        const execute = async () => {
          try {
            const promises: Promise<unknown>[] = [];

            if (!verseCache.has(nextKey)) {
              promises.push(
                fetchVersesData(bId, chapterToFetch, transId).then((data) => {
                  if (data.length > 0) {
                    verseCache.set(nextKey, data);
                  }
                }),
              );
            }

            if (!pericopeCache.has(nextPKey)) {
              promises.push(
                fetchPericopes(bId, chapterToFetch).then((pData) => {
                  pericopeCache.set(nextPKey, pData);
                }),
              );
            }

            await Promise.allSettled(promises);
          } catch {
            // Silencioso para pre-fetch
          }
        };

        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(execute, { timeout: 1500 });
        } else {
          setTimeout(execute, 200);
        }
      };

      // Precargar siguiente capítulo
      schedulePrefetch(ch + 1);
      // Precargar capítulo anterior si ch > 1
      if (ch > 1) {
        schedulePrefetch(ch - 1);
      }
    },
    [fetchVersesData],
  );

  // Efecto principal reactivo ante cambio de libro, capítulo o versión
  useEffect(() => {
    let active = true;
    const currentKey = getVerseCacheKey(effectiveBookId, effectiveChapter, effectiveTranslationId);
    const pKey = getPericopeCacheKey(effectiveBookId, effectiveChapter);

    const isVersesCached = verseCache.has(currentKey);
    const isPericopesCached = pericopeCache.has(pKey);

    // 1. Si ambos ya existen en caché, resolución instantánea en 0 ms
    if (isVersesCached && isPericopesCached) {
      setVerses(verseCache.get(currentKey)!);
      setPericopes(pericopeCache.get(pKey)!);
      setLoading(false);
      setError(null);
      prefetchAdjacentChapters(effectiveBookId, effectiveChapter, effectiveTranslationId);
      return;
    }

    // 2. Si no están completos en caché, solicitar concurrentemente
    setLoading(!isVersesCached);
    setError(null);

    const load = async () => {
      try {
        const versesPromise = isVersesCached
          ? Promise.resolve(verseCache.get(currentKey)!)
          : fetchVersesData(effectiveBookId, effectiveChapter, effectiveTranslationId);

        const pericopesPromise = isPericopesCached
          ? Promise.resolve(pericopeCache.get(pKey)!)
          : effectiveBookId && effectiveChapter
          ? fetchPericopes(effectiveBookId, effectiveChapter)
          : Promise.resolve([]);

        const [serverVerses, serverPericopes] = await Promise.all([
          versesPromise,
          pericopesPromise,
        ]);

        if (!active) return;

        verseCache.set(currentKey, serverVerses);
        pericopeCache.set(pKey, serverPericopes);

        // Actualización atómica en el mismo ciclo de renderizado
        setVerses(serverVerses);
        setPericopes(serverPericopes);
        setLoading(false);
        prefetchAdjacentChapters(effectiveBookId, effectiveChapter, effectiveTranslationId);
      } catch (err: unknown) {
        if (!active) return;

        const isNetworkError =
          err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch');

        if (isNetworkError) {
          setError('No se pudo conectar con el servidor de datos (localhost:3000).');
        } else {
          setError(err instanceof Error ? err.message : 'Error de conexión con el servidor');
        }
        setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [
    effectiveBookId,
    effectiveChapter,
    effectiveTranslationId,
    fetchVersesData,
    prefetchAdjacentChapters,
  ]);

  const handleSelectBook = useCallback((id: number | null) => {
    setInternalBookId(id);
    setInternalChapter(id !== null ? 1 : null);
  }, []);

  const nextChapter = useCallback((maxChapters: number = 150) => {
    setInternalChapter((prev) => {
      if (prev === null) return 1;
      return prev < maxChapters ? prev + 1 : prev;
    });
  }, []);

  const prevChapter = useCallback(() => {
    setInternalChapter((prev) => {
      if (prev === null || prev <= 1) return 1;
      return prev - 1;
    });
  }, []);

  const refetch = useCallback(() => {
    const currentKey = getVerseCacheKey(effectiveBookId, effectiveChapter, effectiveTranslationId);
    const currentPKey = getPericopeCacheKey(effectiveBookId, effectiveChapter);
    verseCache.delete(currentKey);
    pericopeCache.delete(currentPKey);
    setLoading(true);

    if (effectiveBookId && effectiveChapter) {
      void fetchPericopes(effectiveBookId, effectiveChapter).then((pData) => {
        pericopeCache.set(currentPKey, pData);
        setPericopes(pData);
      });
    }

    void fetchVersesData(effectiveBookId, effectiveChapter, effectiveTranslationId)
      .then((data) => {
        verseCache.set(currentKey, data);
        setVerses(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error al recargar');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [effectiveBookId, effectiveChapter, effectiveTranslationId, fetchVersesData]);

  return {
    verses,
    pericopes,
    loading,
    error,
    selectedBookId: effectiveBookId,
    setSelectedBookId: handleSelectBook,
    selectedTranslationId: effectiveTranslationId,
    setSelectedTranslationId: setInternalTranslationId,
    selectedChapter: effectiveChapter,
    setSelectedChapter: setInternalChapter,
    readerSettings,
    setLayoutMode,
    setFontSize,
    setFontFamily,
    toggleFocusMode,
    setFocusMode,
    toggleVerseNumbers,
    togglePericopes,
    nextChapter,
    prevChapter,
    refetch,
  };
}
