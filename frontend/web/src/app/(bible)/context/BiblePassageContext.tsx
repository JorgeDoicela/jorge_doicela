'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useBooks, Book } from '../features/books';
import { getChaptersForBookId } from '../features/books/data/canonicCategories';
import {
  useTranslations,
  Translation,
  resolveInitialTranslationId,
  saveTranslationPreference,
  getDefaultTranslationId,
  getSavedTranslationId,
  getTranslationLanguageGroup,
} from '../features/translations';
import { useBibleKeybindings } from '../hooks/useBibleKeybindings';


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

  isRightInspectorOpen: boolean;
  toggleRightInspector: () => void;
  setRightInspectorOpen: (open: boolean) => void;
  activeInspectorTab: 'strong' | 'versions' | 'notes';
  setActiveInspectorTab: (tab: 'strong' | 'versions' | 'notes') => void;

  inspectedWord: InspectedWordData | null;
  inspectedVerse: InspectedVerseData | null;
  openInspectorWithWord: (word: InspectedWordData) => void;
  openInspectorWithVerse: (verse: InspectedVerseData) => void;
  closeInspector: () => void;
}

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

  // Control del Panel Lateral Izquierdo (Navegación Canónica):
  // Inicialización determinista en false para evitar Hydration Mismatch entre SSR y cliente
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);

  // Sincronización post-montaje con localStorage y viewport (cliente)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('bible_left_sidebar_open');
      if (saved !== null) {
        setIsLeftSidebarOpen(saved === 'true');
      } else if (window.innerWidth >= 1280) {
        setIsLeftSidebarOpen(true);
      }

      // Si no hubo ?trans= en la URL, verificar si el usuario tiene una traducción guardada
      if (!initialTransParam) {
        const savedTrans = getSavedTranslationId(locale);
        if (savedTrans !== null) {
          setSelectedTranslationId(savedTrans);
        }
      }
    } catch {
      // Fallback silencioso si localStorage está restringido
    }
  }, [initialTransParam, locale]);

  const toggleLeftSidebar = useCallback(() => {
    setIsLeftSidebarOpen((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
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
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('bible_left_sidebar_open', String(open));
      } catch {
        // Ignorar si localStorage está restringido en el navegador
      }
    }
  }, []);

  // Control del Panel Lateral Derecho (Inspector Exegético de Versículos & Strong)
  const [isRightInspectorOpen, setIsRightInspectorOpen] = useState<boolean>(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'strong' | 'versions' | 'notes'>('strong');
  const [inspectedWord, setInspectedWord] = useState<InspectedWordData | null>(null);
  const [inspectedVerse, setInspectedVerse] = useState<InspectedVerseData | null>(null);

  const toggleRightInspector = useCallback(() => {
    setIsRightInspectorOpen((prev) => !prev);
  }, []);

  const openInspectorWithWord = useCallback((word: InspectedWordData) => {
    setInspectedWord(word);
    setActiveInspectorTab('strong');
    setIsRightInspectorOpen(true);
  }, []);

  const openInspectorWithVerse = useCallback((verse: InspectedVerseData) => {
    setInspectedVerse(verse);
    setActiveInspectorTab('versions');
    setIsRightInspectorOpen(true);
  }, []);

  const setRightInspectorOpen = useCallback((open: boolean) => {
    setIsRightInspectorOpen(open);
  }, []);

  // Control de visibilidad del Header Superior sincronizado con el scroll
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);

  const closeInspector = useCallback(() => {
    setIsRightInspectorOpen(false);
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

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || books[0],
    [books, selectedBookId]
  );

  const activeTranslation = useMemo(
    () => translations.find((t) => t.id === selectedTranslationId) || translations[0],
    [translations, selectedTranslationId]
  );

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
        isRightInspectorOpen,
        toggleRightInspector,
        setRightInspectorOpen,
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

