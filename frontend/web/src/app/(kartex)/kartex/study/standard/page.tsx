'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { VerseList, useVerses } from '../../../features/verses';
import { useKartexPassage } from '../../../entities/passage';

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
  } = useKartexPassage();

  const localizedBookName = selectedBook
    ? (tBooks.has(selectedBook.abbreviation as any)
        ? tBooks(selectedBook.abbreviation as any)
        : selectedBook.name)
    : '';

  const {
    verses,
    pericopes,
    loading: versesLoading,
    error: versesError,
    readerSettings,
    setLayoutMode,
    setFontSize,
    setFontFamily,
    toggleFocusMode,
    toggleVerseNumbers,
    togglePericopes,
    refetch,
  } = useVerses(selectedBookId, selectedChapter, selectedTranslationId);

  return (
    <div className="space-y-2">
      <VerseList
        verses={verses}
        pericopes={pericopes}
        loading={versesLoading}
        error={versesError}
        onRetry={refetch}
        readerSettings={readerSettings}
        onLayoutModeChange={setLayoutMode}
        onFontSizeChange={setFontSize}
        onFontFamilyChange={setFontFamily}
        onToggleFocusMode={toggleFocusMode}
        onToggleVerseNumbers={toggleVerseNumbers}
        onTogglePericopes={togglePericopes}
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
