'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getChapterCountForBook } from '../../data/bookChapters';

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
  translationAbbr,
}) => {
  const tToolbar = useTranslations('Toolbar');
  const tBooks = useTranslations('Books');
  const maxChapters = getChapterCountForBook(selectedBookAbbr);
  const currentChapter = selectedChapter || 1;

  const localizedBookName = (() => {
    if (selectedBookAbbr) {
      try {
        const translated = tBooks(selectedBookAbbr as any);
        if (translated) return translated;
      } catch {
        // fallback
      }
    }
    return selectedBookName || '';
  })();

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
    <div className="w-full mt-10 pt-6 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Botón Anterior */}
      <button
        type="button"
        onClick={onPrevChapter}
        disabled={currentChapter <= 1}
        className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
          currentChapter <= 1
            ? 'opacity-40 cursor-not-allowed border-zinc-200 dark:border-zinc-800 text-zinc-400'
            : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-xs'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>
          {tToolbar('chapterNumber', {
            chapter: (currentChapter > 1 ? currentChapter - 1 : 1).toString(),
          })}
        </span>
      </button>

      {/* Referencia central activa */}
      <div className="text-center">
        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {localizedBookName} {currentChapter}
        </div>
        <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
          {translationAbbr ? `${translationAbbr} • ` : ''}
          {tToolbar('chapterOf', {
            current: currentChapter.toString(),
            total: maxChapters.toString(),
          })}
        </div>
      </div>

      {/* Botón Siguiente */}
      <button
        type="button"
        onClick={() => onNextChapter(maxChapters)}
        disabled={currentChapter >= maxChapters}
        className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
          currentChapter >= maxChapters
            ? 'opacity-40 cursor-not-allowed border-zinc-200 dark:border-zinc-800 text-zinc-400'
            : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-xs'
        }`}
      >
        <span>
          {tToolbar('chapterNumber', {
            chapter: (currentChapter < maxChapters ? currentChapter + 1 : maxChapters).toString(),
          })}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
