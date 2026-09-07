'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
  getTranslationLanguageGroup,
} from '../features/translations';

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

  // Resolución profesional: 1) URL -> 2) localStorage -> 3) Locale (ES: NBLA [3], EN: NIV [5])
  const [selectedTranslationId, setSelectedTranslationId] = useState<number | null>(() => {
    return resolveInitialTranslationId({
      urlParam: initialTransParam,
      locale,
    });
  });

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
