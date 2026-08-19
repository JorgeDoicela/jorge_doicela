'use client';

import React, { useEffect } from 'react';
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
  const maxChapters = getChapterCountForBook(selectedBookAbbr);
  const currentChapter = selectedChapter || 1;

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
    <div className="w-full max-w-3xl mx-auto mt-8 pt-6 border-t border-accents-2 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Botón Anterior */}
      <button
        type="button"
        onClick={onPrevChapter}
        disabled={currentChapter <= 1}
        className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
          currentChapter <= 1
            ? 'opacity-40 cursor-not-allowed border-accents-2 text-accents-4'
            : 'border-accents-2 bg-background hover:border-foreground text-foreground shadow-xs'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>
          Capítulo {currentChapter > 1 ? currentChapter - 1 : 1}
        </span>
      </button>

      {/* Referencia central activa */}
      <div className="text-center">
        <div className="text-xs font-semibold text-foreground">
          {selectedBookName} {currentChapter}
        </div>
        <div className="text-[10px] font-mono text-accents-4">
          {translationAbbr ? `${translationAbbr} • ` : ''}Capítulo {currentChapter} de {maxChapters}
        </div>
      </div>

      {/* Botón Siguiente */}
      <button
        type="button"
        onClick={() => onNextChapter(maxChapters)}
        disabled={currentChapter >= maxChapters}
        className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
          currentChapter >= maxChapters
            ? 'opacity-40 cursor-not-allowed border-accents-2 text-accents-4'
            : 'border-accents-2 bg-background hover:border-foreground text-foreground shadow-xs'
        }`}
      >
        <span>
          Capítulo {currentChapter < maxChapters ? currentChapter + 1 : maxChapters}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
