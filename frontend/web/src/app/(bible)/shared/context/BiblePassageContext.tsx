'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useBooks, Book } from '../../entities/books';
import { getChaptersForBookId } from '../data/canonData';
import {
  useTranslations,
  Translation,
  resolveInitialTranslationId,
  saveTranslationPreference,
  getDefaultTranslationId,
  getSavedTranslationId,
  getTranslationLanguageGroup,
} from '../../entities/translations';
import { useBibleKeybindings } from '../hooks/useBibleKeybindings';
import { safeStorage } from '../utils';

export interface InspectedWordData {
  strongNumber: string;
  wordText: string;
  transliteration?: string;
  pronunciation?: string;
  lemma?: string;
  definition?: string;
  grammar?: string;
  language?: 'hebrew' | 'greek' | 'aramaic';
}

export interface InspectedVerseData {
  bookId: number;
  bookName: string;
  chapter: number;
  verseNumber: number;
  text: string;
}

export type InspectorTab = 'strong' | 'versions' | 'historical' | 'apologetics' | 'notes';

interface BiblePassageContextValue {
  books: Book[];
  translations: Translation[];
  selectedBookId: number;
  selectedChapter: number;
  selectedTranslationId: number | null;
  selectedBook?: Book;
  activeTranslation?: Translation;
  setPassage: (bookId: number, chapter: number) => void;
  setSelectedTranslationId: (id: number | null) => void;
  nextChapter: () => void;
  prevChapter: () => void;

  // Control de visibilidad del Header Superior sincronizado con el scroll
  isHeaderVisible: boolean;
  setIsHeaderVisible: (visible: boolean) => void;

  // Control de Paneles Laterales del Workspace Studio
  isLeftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  setLeftSidebarOpen: (open: boolean) => void;
  leftSidebarWidth: number;
  setLeftSidebarWidth: (width: number) => void;
  resetLeftSidebarWidth: () => void;

  isRightInspectorOpen: boolean;
  toggleRightInspector: () => void;
  setRightInspectorOpen: (open: boolean) => void;
  rightInspectorWidth: number;
  setRightInspectorWidth: (width: number) => void;
  resetRightInspectorWidth: () => void;
  activeInspectorTab: InspectorTab;
  setActiveInspectorTab: (tab: InspectorTab) => void;

  inspectedWord: InspectedWordData | null;
  inspectedVerse: InspectedVerseData | null;
  openInspectorWithWord: (word: InspectedWordData) => void;
  openInspectorWithVerse: (verse: InspectedVerseData) => void;
  closeInspector: () => void;
}

export const DEFAULT_LEFT_SIDEBAR_WIDTH = 280;
export const DEFAULT_RIGHT_INSPECTOR_WIDTH = 340;
export const MIN_LEFT_SIDEBAR_WIDTH = 200;
export const MAX_LEFT_SIDEBAR_WIDTH = 480;
export const MIN_RIGHT_INSPECTOR_WIDTH = 200;
export const MAX_RIGHT_INSPECTOR_WIDTH = 480;
export const AUTO_COLLAPSE_THRESHOLD = 175;

const BiblePassageContext = createContext<BiblePassageContextValue | undefined>(undefined);

interface BiblePassageProviderProps {
  children: ReactNode;
}

export const BiblePassageProvider: React.FC<BiblePassageProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const { books } = useBooks();
  const { translations } = useTranslations();

  // Obtener estado inicial desde URL query params si existen
  const initialBookParam = searchParams.get('book');
  const initialChapterParam = searchParams.get('chapter');
  const initialTransParam = searchParams.get('trans');

  const [selectedBookId, setSelectedBookId] = useState<number>(() => {
    if (initialBookParam) {
      const parsed = parseInt(initialBookParam, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 1; // Génesis por defecto
  });

  const [selectedChapter, setSelectedChapter] = useState<number>(() => {
    if (initialChapterParam) {
      const parsed = parseInt(initialChapterParam, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 1;
  });

  // Resolución profesional y determinista para SSR:
  // 1) URL Param -> 2) Default Contextual del Locale (ES: NBLA [3], EN: NIV [5])
  // La memoria secundaria de localStorage se sincroniza post-hidratación para evitar Hydration Mismatches
  const [selectedTranslationId, setSelectedTranslationId] = useState<number | null>(() => {
    return resolveInitialTranslationId({
      urlParam: initialTransParam,
      locale,
    });
  });

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || books[0],
    [books, selectedBookId]
  );

  const activeTranslation = useMemo(
    () => translations.find((t) => t.id === selectedTranslationId) || translations[0],
    [translations, selectedTranslationId]
  );

  // Control de Paneles Laterales (Dimensiones Redimensionables y Visibilidad):
  // Inicialización determinista en false para evitar Hydration Mismatch entre SSR y cliente
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  const [isRightInspectorOpen, setIsRightInspectorOpen] = useState<boolean>(false);

  const [leftSidebarWidth, setLeftSidebarWidthState] = useState<number>(DEFAULT_LEFT_SIDEBAR_WIDTH);
  const [rightInspectorWidth, setRightInspectorWidthState] = useState<number>(DEFAULT_RIGHT_INSPECTOR_WIDTH);

  const setLeftSidebarWidth = useCallback((width: number) => {
    const max = typeof window !== 'undefined' ? Math.min(MAX_LEFT_SIDEBAR_WIDTH, Math.max(MIN_LEFT_SIDEBAR_WIDTH, Math.round(window.innerWidth * 0.38))) : MAX_LEFT_SIDEBAR_WIDTH;
    const clamped = Math.max(120, Math.min(width, max));
    setLeftSidebarWidthState(clamped);
    // Solo persistir si está por encima del ancho mínimo de diseño para que nunca abra comprimido
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && clamped >= MIN_LEFT_SIDEBAR_WIDTH) {
      safeStorage.setItem('bible_left_sidebar_width', String(clamped));
    }
  }, []);

  const resetLeftSidebarWidth = useCallback(() => {
    setLeftSidebarWidthState(DEFAULT_LEFT_SIDEBAR_WIDTH);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      safeStorage.removeItem('bible_left_sidebar_width');
    }
  }, []);

  const setRightInspectorWidth = useCallback((width: number) => {
    const max = typeof window !== 'undefined' ? Math.min(MAX_RIGHT_INSPECTOR_WIDTH, Math.max(MIN_RIGHT_INSPECTOR_WIDTH, Math.round(window.innerWidth * 0.38))) : MAX_RIGHT_INSPECTOR_WIDTH;
    const clamped = Math.max(120, Math.min(width, max));
    setRightInspectorWidthState(clamped);
    // Solo persistir si está por encima del ancho mínimo de diseño
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && clamped >= MIN_RIGHT_INSPECTOR_WIDTH) {
      safeStorage.setItem('bible_right_inspector_width', String(clamped));
    }
  }, []);

  const resetRightInspectorWidth = useCallback(() => {
    setRightInspectorWidthState(DEFAULT_RIGHT_INSPECTOR_WIDTH);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      safeStorage.removeItem('bible_right_inspector_width');
    }
  }, []);

  // Sincronización post-montaje con viewport y preferencias guardadas
  useEffect(() => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

    if (isDesktop) {
      // En PC (>= 1024px): Por defecto ambos laterales ABIERTOS
      setIsLeftSidebarOpen(safeStorage.getBoolean('bible_left_sidebar_open', true));
      setIsRightInspectorOpen(safeStorage.getBoolean('bible_right_inspector_open', true));

      const savedLeftW = safeStorage.getNumber('bible_left_sidebar_width', DEFAULT_LEFT_SIDEBAR_WIDTH);
      if (savedLeftW) {
        setLeftSidebarWidthState(Math.min(MAX_LEFT_SIDEBAR_WIDTH, Math.max(MIN_LEFT_SIDEBAR_WIDTH, savedLeftW)));
      }

      const savedRightW = safeStorage.getNumber('bible_right_inspector_width', DEFAULT_RIGHT_INSPECTOR_WIDTH);
      if (savedRightW) {
        setRightInspectorWidthState(Math.min(MAX_RIGHT_INSPECTOR_WIDTH, Math.max(MIN_RIGHT_INSPECTOR_WIDTH, savedRightW)));
      }
    } else {
      // En Móvil (< 1024px): Por defecto ambos laterales CERRADOS
      setIsLeftSidebarOpen(false);
      setIsRightInspectorOpen(false);
    }

    // Si no hubo ?trans= en la URL, verificar si el usuario tiene una traducción guardada
    if (!initialTransParam) {
      const savedTrans = getSavedTranslationId(locale);
      if (savedTrans !== null) {
        setSelectedTranslationId(savedTrans);
      }
    }
  }, [initialTransParam, locale]);

  // Transición reactiva y fluida entre PC y Móvil al redimensionar la ventana
  useEffect(() => {
    let prevWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const wasDesktop = prevWidth >= 1024;
      const isDesktop = currentWidth >= 1024;

      if (wasDesktop && !isDesktop) {
        // Al pasar de PC a móvil, colapsar ambos laterales para despejar la lectura
        setIsLeftSidebarOpen(false);
        setIsRightInspectorOpen(false);
      } else if (!wasDesktop && isDesktop) {
        // Al pasar de móvil a PC, restaurar ambos abiertos por defecto (o según preferencia)
        try {
          const savedLeft = window.localStorage.getItem('bible_left_sidebar_open');
          setIsLeftSidebarOpen(savedLeft !== null ? savedLeft === 'true' : true);

          const savedRight = window.localStorage.getItem('bible_right_inspector_open');
          setIsRightInspectorOpen(savedRight !== null ? savedRight === 'true' : true);
        } catch {
          setIsLeftSidebarOpen(true);
          setIsRightInspectorOpen(true);
        }
      }

      prevWidth = currentWidth;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLeftSidebar = useCallback(() => {
    setIsLeftSidebarOpen((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        try {
          window.localStorage.setItem('bible_left_sidebar_open', String(next));
        } catch {
          // Ignorar si localStorage está restringido en el navegador
        }
      }
      return next;
    });
  }, []);

  const setLeftSidebarOpen = useCallback((open: boolean) => {
    setIsLeftSidebarOpen(open);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      try {
        window.localStorage.setItem('bible_left_sidebar_open', String(open));
      } catch {
        // Ignorar si localStorage está restringido en el navegador
      }
    }
  }, []);

  const [activeInspectorTab, setActiveInspectorTab] = useState<InspectorTab>('versions');
  const [inspectedWord, setInspectedWord] = useState<InspectedWordData | null>(null);
  const [inspectedVerse, setInspectedVerse] = useState<InspectedVerseData | null>(() => ({
    bookId: selectedBookId || 1,
    bookName: 'Génesis',
    chapter: selectedChapter || 1,
    verseNumber: 1,
    text: '',
  }));

  // Sincronizar el versículo inspeccionado por defecto al cambiar libro o capítulo si no pertenece al pasaje actual
  useEffect(() => {
    setInspectedVerse((prev) => {
      if (!prev || prev.bookId !== selectedBookId || prev.chapter !== selectedChapter) {
        return {
          bookId: selectedBookId,
          bookName: selectedBook?.name || 'Génesis',
          chapter: selectedChapter,
          verseNumber: 1,
          text: '',
        };
      }
      return prev;
    });
  }, [selectedBookId, selectedChapter, selectedBook?.name]);

  const toggleRightInspector = useCallback(() => {
    setIsRightInspectorOpen((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        safeStorage.setItem('bible_right_inspector_open', String(next));
      }
      return next;
    });
  }, []);

  const openInspectorWithWord = useCallback((word: InspectedWordData) => {
    setInspectedWord(word);
    setActiveInspectorTab('strong');
    setIsRightInspectorOpen(true);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      safeStorage.setItem('bible_right_inspector_open', 'true');
    }
  }, []);

  const openInspectorWithVerse = useCallback((verse: InspectedVerseData) => {
    setInspectedVerse(verse);
    setActiveInspectorTab('versions');
    setIsRightInspectorOpen(true);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      safeStorage.setItem('bible_right_inspector_open', 'true');
    }
  }, []);

  const setRightInspectorOpen = useCallback((open: boolean) => {
    setIsRightInspectorOpen(open);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      safeStorage.setItem('bible_right_inspector_open', String(open));
    }
  }, []);

  // Control de visibilidad del Header Superior sincronizado con el scroll
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);

  const closeInspector = useCallback(() => {
    setIsRightInspectorOpen(false);
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      safeStorage.setItem('bible_right_inspector_open', 'false');
    }
  }, []);

  // Reaccionar al cambio de idioma de la interfaz (ES <-> EN) de manera inmediata y fluida
  useEffect(() => {
    const cleanLocale = locale && locale.toLowerCase().startsWith('en') ? 'en' : 'es';
    const currentGroup = selectedTranslationId
      ? getTranslationLanguageGroup(selectedTranslationId)
      : null;

    // Si la traducción actual pertenece a un idioma distinto al nuevo locale de la app
    if (currentGroup && currentGroup !== 'ancient' && currentGroup !== cleanLocale) {
      const preferredId = resolveInitialTranslationId({ locale: cleanLocale });
      setSelectedTranslationId(preferredId);

      const params = new URLSearchParams(searchParams.toString());
      params.set('book', selectedBookId.toString());
      params.set('chapter', selectedChapter.toString());
      params.set('trans', preferredId.toString());
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [locale, selectedTranslationId, selectedBookId, selectedChapter, searchParams, pathname, router]);

  // Si los libros cargan y se especificó una abreviatura en la URL
  useEffect(() => {
    if (initialBookParam && isNaN(Number(initialBookParam)) && books.length > 0) {
      const match = books.find(
        (b) => b.abbreviation.toLowerCase() === initialBookParam.toLowerCase() ||
               b.name.toLowerCase() === initialBookParam.toLowerCase()
      );
      if (match) {
        setSelectedBookId(match.id);
      }
    }
  }, [initialBookParam, books]);

  // Sincronizar cambios en los search params de la URL de forma fluida
  const updateUrlParams = (bookId: number, chapter: number, transId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('book', bookId.toString());
    params.set('chapter', chapter.toString());
    if (transId) {
      params.set('trans', transId.toString());
    } else {
      params.delete('trans');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setPassage = (bookId: number, chapter: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(chapter);
    setIsHeaderVisible(true);
    updateUrlParams(bookId, chapter, selectedTranslationId);
  };

  const handleSetTranslation = (id: number | null) => {
    const targetId = id ?? getDefaultTranslationId(locale);
    if (id !== null) {
      saveTranslationPreference(id, locale);
    }
    setSelectedTranslationId(targetId);
    updateUrlParams(selectedBookId, selectedChapter, targetId);
  };

  const nextChapter = () => {
    if (!selectedBook) return;
    const totalChapters = getChaptersForBookId(selectedBookId);
    if (selectedChapter < totalChapters) {
      setPassage(selectedBookId, selectedChapter + 1);
    } else {
      // Siguiente libro
      const currentIdx = books.findIndex((b) => b.id === selectedBookId);
      if (currentIdx >= 0 && currentIdx < books.length - 1) {
        const nextBook = books[currentIdx + 1];
        setPassage(nextBook.id, 1);
      }
    }
  };

  const prevChapter = () => {
    if (!selectedBook) return;
    if (selectedChapter > 1) {
      setPassage(selectedBookId, selectedChapter - 1);
    } else {
      // Libro anterior
      const currentIdx = books.findIndex((b) => b.id === selectedBookId);
      if (currentIdx > 0) {
        const prevBook = books[currentIdx - 1];
        const prevBookTotal = getChaptersForBookId(prevBook.id);
        setPassage(prevBook.id, prevBookTotal || 1);
      }
    }
  };

  // Atajos de Teclado Profesionales para Navegación y Control de Paneles
  useBibleKeybindings({
    onToggleLeftSidebar: toggleLeftSidebar,
    onToggleRightInspector: toggleRightInspector,
    onPrevChapter: prevChapter,
    onNextChapter: nextChapter,
    onCloseInspector: closeInspector,
  });

  return (
    <BiblePassageContext.Provider
      value={{
        books,
        translations,
        selectedBookId,
        selectedChapter,
        selectedTranslationId,
        selectedBook,
        activeTranslation,
        setPassage,
        setSelectedTranslationId: handleSetTranslation,
        nextChapter,
        prevChapter,

        // Control de visibilidad del Header Superior sincronizado con el scroll
        isHeaderVisible,
        setIsHeaderVisible,

        // Paneles laterales del Workspace Studio
        isLeftSidebarOpen,
        toggleLeftSidebar,
        setLeftSidebarOpen,
        leftSidebarWidth,
        setLeftSidebarWidth,
        resetLeftSidebarWidth,
        isRightInspectorOpen,
        toggleRightInspector,
        setRightInspectorOpen,
        rightInspectorWidth,
        setRightInspectorWidth,
        resetRightInspectorWidth,
        activeInspectorTab,
        setActiveInspectorTab,
        inspectedWord,
        inspectedVerse,
        openInspectorWithWord,
        openInspectorWithVerse,
        closeInspector,
      }}
    >
      {children}
    </BiblePassageContext.Provider>
  );
};

export const useBiblePassage = () => {
  const context = useContext(BiblePassageContext);
  if (!context) {
    throw new Error('useBiblePassage debe usarse dentro de un BiblePassageProvider');
  }
  return context;
};

export const useBiblePassageSafe = () => {
  return useContext(BiblePassageContext);
};
