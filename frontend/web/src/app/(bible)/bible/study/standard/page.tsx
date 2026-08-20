'use client';

import React from 'react';
import { VerseList, useVerses } from '../../../features/verses';
import { useBiblePassage } from '../../../context/BiblePassageContext';

export default function StandardStudyPage() {
  const {
    books,
    selectedBookId,
    selectedChapter,
    selectedTranslationId,
    setSelectedTranslationId,
    selectedBook,
    activeTranslation,
    setPassage,
    nextChapter,
    prevChapter,
  } = useBiblePassage();

  const {
    verses,
    loading: versesLoading,
    error: versesError,
    readerSettings,
    setLayoutMode,
    setFontSize,
    setFontFamily,
    toggleVerseNumbers,
  } = useVerses(selectedBookId, selectedChapter, selectedTranslationId || 1);

  return (
    <div className="space-y-4">
      <VerseList
        verses={verses}
        loading={versesLoading}
        error={versesError}
        readerSettings={readerSettings}
        onLayoutModeChange={setLayoutMode}
        onFontSizeChange={setFontSize}
        onFontFamilyChange={setFontFamily}
        onToggleVerseNumbers={toggleVerseNumbers}
        books={books}
        selectedBookId={selectedBookId}
        onSelectBook={(bookId) => {
          if (bookId !== null) setPassage(bookId, 1);
        }}
        selectedBookName={selectedBook?.name}
        selectedBookAbbr={selectedBook?.abbreviation}
        selectedChapter={selectedChapter}
        onSelectChapter={(chap) => {
          if (chap !== null) setPassage(selectedBookId, chap);
        }}
        onPrevChapter={prevChapter}
        onNextChapter={nextChapter}
        selectedTranslationId={selectedTranslationId}
        onSelectTranslation={setSelectedTranslationId}
        activeTranslationName={activeTranslation?.name}
        activeTranslationAbbr={activeTranslation?.abbreviation}
      />
    </div>
  );
}
