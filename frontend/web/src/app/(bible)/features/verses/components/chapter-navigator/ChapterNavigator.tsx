'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getChapterCountForBook } from '../../data/bookChapters';
import { useBiblePassageSafe } from '../../../../context/BiblePassageContext';

interface ChapterNavigatorProps {
  selectedBookName?: string;
  selectedBookAbbr?: string;
  selectedChapter: number | null;
  onPrevChapter: () => void;
  onNextChapter: (maxChapters?: number) => void;
  translationAbbr?: string;
}

export const ChapterNavigator: React.FC<ChapterNavigatorProps> = ({
  selectedBookName,
  selectedBookAbbr,
  selectedChapter,
  onPrevChapter,
  onNextChapter,
}) => {
  const tToolbar = useTranslations('Toolbar');
  const maxChapters = getChapterCountForBook(selectedBookAbbr);
  const currentChapter = selectedChapter || 1;

  const passageContext = useBiblePassageSafe();
  const isLeftOpen = passageContext?.isLeftSidebarOpen ?? false;
  const isRightOpen = passageContext?.isRightInspectorOpen ?? false;

  const books = passageContext?.books ?? [];
  const currentBookIdx = passageContext?.selectedBookId
    ? books.findIndex((b) => b.id === passageContext.selectedBookId)
    : -1;
  const prevBook = currentBookIdx > 0 ? books[currentBookIdx - 1] : null;
  const nextBook =
    currentBookIdx >= 0 && currentBookIdx < books.length - 1
      ? books[currentBookIdx + 1]
      : null;

  const canGoPrev = currentChapter > 1 || prevBook !== null;
  const canGoNext = currentChapter < maxChapters || nextBook !== null;

  // Atajos de teclado: Flecha izquierda / derecha para navegar capítulos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input o textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && canGoPrev) {
        onPrevChapter();
      } else if (e.key === 'ArrowRight' && canGoNext) {
        onNextChapter(maxChapters);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter, maxChapters, canGoPrev, canGoNext, onPrevChapter, onNextChapter]);

  if (!selectedBookName || selectedChapter === null) {
    return null;
  }

  const prevLabel = currentChapter > 1 ? (currentChapter - 1).toString() : (prevBook?.abbreviation || prevBook?.name || '');
  const prevTitle = currentChapter > 1
    ? tToolbar('chapterNumber', { chapter: (currentChapter - 1).toString() })
    : (prevBook?.name || '');

  const nextLabel = currentChapter < maxChapters ? (currentChapter + 1).toString() : (nextBook?.abbreviation || nextBook?.name || '');
  const nextTitle = currentChapter < maxChapters
    ? tToolbar('chapterNumber', { chapter: (currentChapter + 1).toString() })
    : (nextBook?.name || '');

  return (
    <>
      {/* Botones Flotantes Laterales Fijos y Adaptables al estado de los paneles laterales y móvil */}
      {canGoPrev && (
        <button
          type="button"
          onClick={onPrevChapter}
          title={prevTitle}
          aria-label={prevTitle}
          className={`fixed top-1/2 -translate-y-1/2 z-35 flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xs text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-[left,right,transform,background-color,border-color,box-shadow] duration-300 ease-in-out cursor-pointer print:hidden group select-none ${
            isLeftOpen ? 'lg:left-[calc(20rem+1rem)] left-2 sm:left-4' : 'left-2 sm:left-4'
          }`}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-tight">
            {prevLabel}
          </span>
        </button>
      )}

      {canGoNext && (
        <button
          type="button"
          onClick={() => onNextChapter(maxChapters)}
          title={nextTitle}
          aria-label={nextTitle}
          className={`fixed top-1/2 -translate-y-1/2 z-35 flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xs text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-[left,right,transform,background-color,border-color,box-shadow] duration-300 ease-in-out cursor-pointer print:hidden group select-none ${
            isRightOpen ? 'lg:right-[calc(22rem+1rem)] xl:right-[calc(24rem+1rem)] right-2 sm:right-4' : 'right-2 sm:right-4'
          }`}
        >
          <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-tight">
            {nextLabel}
          </span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </>
  );
};
