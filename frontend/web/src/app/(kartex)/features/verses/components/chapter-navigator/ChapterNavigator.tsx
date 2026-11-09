'use client';

import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getChapterCountForBook } from '../../../../shared/data/canonData';
import { useKartexPassageSafe } from '../../../../entities/passage';

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

  const passageContext = useKartexPassageSafe();

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

  const prevLabel = currentChapter > 1
    ? `${selectedBookName} ${currentChapter - 1}`
    : (prevBook?.name || '');

  const nextLabel = currentChapter < maxChapters
    ? `${selectedBookName} ${currentChapter + 1}`
    : (nextBook?.name || '');

  return (
    <>
      {/* Flecha Lateral Flotante Izquierda - Capítulo Anterior (PC) */}
      {canGoPrev && (
        <aside
          aria-label={prevLabel}
          className="hidden lg:block absolute -left-6 sm:-left-7 top-0 bottom-0 pointer-events-none z-30 select-none print:hidden"
        >
          <div className="sticky top-1/2 -translate-y-1/2 pointer-events-auto">
            <button
              type="button"
              onClick={onPrevChapter}
              title={`${prevLabel} (←)`}
              aria-label={prevLabel}
              className="p-1 text-accents-4 hover:text-foreground hover:scale-115 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>
        </aside>
      )}

      {/* Flecha Lateral Flotante Derecha - Capítulo Siguiente (PC) */}
      {canGoNext && (
        <aside
          aria-label={nextLabel}
          className="hidden lg:block absolute -right-6 sm:-right-7 top-0 bottom-0 pointer-events-none z-30 select-none print:hidden"
        >
          <div className="sticky top-1/2 -translate-y-1/2 pointer-events-auto">
            <button
              type="button"
              onClick={() => onNextChapter(maxChapters)}
              title={`${nextLabel} (→)`}
              aria-label={nextLabel}
              className="p-1 text-accents-4 hover:text-foreground hover:scale-115 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
