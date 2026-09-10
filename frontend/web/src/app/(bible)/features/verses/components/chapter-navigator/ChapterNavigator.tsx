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

      if (e.key === 'ArrowLeft' && currentChapter > 1) {
        onPrevChapter();
      } else if (e.key === 'ArrowRight' && currentChapter < maxChapters) {
        onNextChapter(maxChapters);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter, maxChapters, onPrevChapter, onNextChapter]);

  if (!selectedBookName || selectedChapter === null) {
    return null;
  }

  return (
    <>
      {/* Botones Flotantes Laterales Fijos y Adaptables al estado de los paneles laterales */}
      {currentChapter > 1 && (
        <button
          type="button"
          onClick={onPrevChapter}
          title={tToolbar('chapterNumber', { chapter: (currentChapter - 1).toString() })}
          aria-label={tToolbar('chapterNumber', { chapter: (currentChapter - 1).toString() })}
          className={`fixed top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center gap-1.5 h-9 px-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0a] text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-[left,right,transform,background-color,border-color,box-shadow] duration-300 ease-in-out cursor-pointer print:hidden group select-none ${
            isLeftOpen ? 'lg:left-[calc(20rem+1rem)] left-4' : 'left-4'
          }`}
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs font-mono font-semibold tracking-tight">
            {currentChapter - 1}
          </span>
        </button>
      )}

      {currentChapter < maxChapters && (
        <button
          type="button"
          onClick={() => onNextChapter(maxChapters)}
          title={tToolbar('chapterNumber', { chapter: (currentChapter + 1).toString() })}
          aria-label={tToolbar('chapterNumber', { chapter: (currentChapter + 1).toString() })}
          className={`fixed top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center gap-1.5 h-9 px-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0a] text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-[left,right,transform,background-color,border-color,box-shadow] duration-300 ease-in-out cursor-pointer print:hidden group select-none ${
            isRightOpen ? 'lg:right-[calc(22rem+1rem)] xl:right-[calc(24rem+1rem)] right-4' : 'right-4'
          }`}
        >
          <span className="text-xs font-mono font-semibold tracking-tight">
            {currentChapter + 1}
          </span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </>
  );
};
