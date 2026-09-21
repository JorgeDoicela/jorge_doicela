'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getChapterCountForBook } from '../../../../shared/data/canonData';
import { useBiblePassageSafe } from '../../../../shared/context';

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
  const tPassage = useTranslations('PassagePicker');
  const maxChapters = getChapterCountForBook(selectedBookAbbr);
  const currentChapter = selectedChapter || 1;

  const passageContext = useBiblePassageSafe();

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

  const prevSubtitle = currentChapter > 1
    ? tPassage('prevChapterTooltip').replace(' (←)', '')
    : 'Libro anterior';
  const prevLabel = currentChapter > 1
    ? `${selectedBookName} ${currentChapter - 1}`
    : (prevBook?.name || '');

  const nextSubtitle = currentChapter < maxChapters
    ? tPassage('nextChapterTooltip').replace(' (→)', '')
    : 'Libro siguiente';
  const nextLabel = currentChapter < maxChapters
    ? `${selectedBookName} ${currentChapter + 1}`
    : (nextBook?.name || '');

  return (
    <nav
      aria-label="Navegación de capítulos"
      className="w-full flex items-center justify-between gap-4 pt-4 pb-2 print:hidden select-none"
    >
      {canGoPrev ? (
        <button
          type="button"
          onClick={onPrevChapter}
          title={prevLabel}
          aria-label={prevLabel}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xs text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs hover:shadow-md active:scale-98 transition-all cursor-pointer group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-zinc-400 group-hover:text-foreground shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
          </svg>
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {prevSubtitle}
            </span>
            <span className="text-xs font-semibold text-foreground">
              {prevLabel}
            </span>
          </div>
        </button>
      ) : (
        <div />
      )}

      {canGoNext ? (
        <button
          type="button"
          onClick={() => onNextChapter(maxChapters)}
          title={nextLabel}
          aria-label={nextLabel}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xs text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs hover:shadow-md active:scale-98 transition-all cursor-pointer group ml-auto"
        >
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {nextSubtitle}
            </span>
            <span className="text-xs font-semibold text-foreground">
              {nextLabel}
            </span>
          </div>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-zinc-400 group-hover:text-foreground shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <div />
      )}
    </nav>
  );
};
