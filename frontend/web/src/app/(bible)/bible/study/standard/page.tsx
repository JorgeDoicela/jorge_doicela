'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { VerseList, useVerses } from '../../../features/verses';
import { useBiblePassage } from '../../../context/BiblePassageContext';

export default function StandardStudyPage() {
  const tBooks = useTranslations('Books');
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

  const localizedBookName = selectedBook
    ? (tBooks.has(selectedBook.abbreviation as any)
        ? tBooks(selectedBook.abbreviation as any)
        : selectedBook.name)
    : '';

  const {
    verses,
    loading: versesLoading,
    error: versesError,
    readerSettings,
    setLayoutMode,
    setFontSize,
    setFontFamily,
    toggleVerseNumbers,
  } = useVerses(selectedBookId, selectedChapter, selectedTranslationId);

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
        onSelectPassage={(bookId, chap) => {
          setPassage(bookId, chap);
        }}
        onSelectBook={(bookId) => {
          if (bookId !== null) setPassage(bookId, 1);
        }}
        selectedBookName={localizedBookName}
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
