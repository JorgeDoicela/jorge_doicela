'use client';

import React from 'react';
import {
  Verse,
  ReaderSettings,
  ReaderLayoutMode,
  ReaderFontSize,
  ReaderFontFamily,
  BookInfo,
} from '../../types';
import { ReaderToolbar } from '../reader-toolbar/ReaderToolbar';
import { ContinuousReadingView } from '../continuous-view/ContinuousReadingView';
import { LineByLineReadingView } from '../line-by-line-view/LineByLineReadingView';
import { ChapterNavigator } from '../chapter-navigator/ChapterNavigator';
import { OngoingExpansionNotice } from '../../../../components/OngoingExpansionNotice';

interface VerseListProps {
  verses: Verse[];
  loading: boolean;
  error: string | null;
  readerSettings: ReaderSettings;
  onLayoutModeChange: (mode: ReaderLayoutMode) => void;
  onFontSizeChange: (size: ReaderFontSize) => void;
  onFontFamilyChange: (family: ReaderFontFamily) => void;
  onToggleVerseNumbers: () => void;
  books?: (BookInfo | { id: number; name: string; abbreviation: string; testament: string })[];
  selectedBookId?: number | null;
  onSelectPassage?: (bookId: number, chapter: number) => void;
  onSelectBook?: (id: number | null) => void;
  selectedBookName?: string;
  selectedBookAbbr?: string;
  selectedChapter: number | null;
  onSelectChapter: (chapter: number | null) => void;
  onPrevChapter: () => void;
  onNextChapter: (maxChapters?: number) => void;
  selectedTranslationId?: number | null;
  onSelectTranslation?: (id: number | null) => void;
  activeTranslationName?: string;
  activeTranslationAbbr?: string;
  onRetry?: () => void;
}

export const VerseList: React.FC<VerseListProps> = ({
  verses,
  loading,
  error,
  readerSettings,
  onLayoutModeChange,
  onFontSizeChange,
  onFontFamilyChange,
  onToggleVerseNumbers,
  books = [],
  selectedBookId,
  onSelectPassage,
  onSelectBook,
  selectedBookName,
  selectedBookAbbr,
  selectedChapter,
  onSelectChapter,
  onPrevChapter,
  onNextChapter,
  selectedTranslationId,
  onSelectTranslation,
  activeTranslationName,
  activeTranslationAbbr,
  onRetry,
}) => {
  return (
    <div className="w-full space-y-2">
      {/* Barra de herramientas integrada del lector */}
      <ReaderToolbar
        readerSettings={readerSettings}
        onLayoutModeChange={onLayoutModeChange}
        onFontSizeChange={onFontSizeChange}
        onFontFamilyChange={onFontFamilyChange}
        onToggleVerseNumbers={onToggleVerseNumbers}
        books={books}
        selectedBookId={selectedBookId}
        onSelectPassage={onSelectPassage}
        onSelectBook={onSelectBook}
        selectedBookAbbr={selectedBookAbbr}
        selectedBookName={selectedBookName}
        selectedChapter={selectedChapter}
        onSelectChapter={onSelectChapter}
        onPrevChapter={onPrevChapter}
        onNextChapter={onNextChapter}
        verses={verses}
        selectedTranslationId={selectedTranslationId}
        onSelectTranslation={onSelectTranslation}
        activeTranslationName={activeTranslationName}
      />

      {/* Estado de carga con Skeleton editorial */}
      {loading && (
        <div className="w-full bg-background rounded-2xl border border-accents-2 p-8 sm:p-12 space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-accents-1 rounded mx-auto mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-accents-1 rounded w-full" />
            <div className="h-4 bg-accents-1 rounded w-11/12" />
            <div className="h-4 bg-accents-1 rounded w-full" />
            <div className="h-4 bg-accents-1 rounded w-4/5" />
            <div className="h-4 bg-accents-1 rounded w-full" />
            <div className="h-4 bg-accents-1 rounded w-3/4" />
          </div>
        </div>
      )}

      {/* Estado de Error con Reintento */}
      {error && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono text-center space-y-3">
          <p className="leading-relaxed">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold transition-colors cursor-pointer"
            >
              Reintentar conexión
            </button>
          )}
        </div>
      )}

      {/* Estado Vacío con Aviso de Plataforma Nueva y Crecimiento Continuo */}
      {!loading && !error && verses.length === 0 && (
        <OngoingExpansionNotice
          onExploreAvailable={() => onSelectChapter(1)}
        />
      )}

      {/* Renderizado de Lectura según el modo seleccionado */}
      {!loading && !error && verses.length > 0 && (
        <>
          {readerSettings.layoutMode === 'continuous' ? (
            <ContinuousReadingView
              verses={verses}
              fontSize={readerSettings.fontSize}
              fontFamily={readerSettings.fontFamily}
              showVerseNumbers={readerSettings.showVerseNumbers}
              bookName={selectedBookName}
              bookAbbr={selectedBookAbbr}
              chapter={selectedChapter}
              translationName={activeTranslationName}
              translationAbbr={activeTranslationAbbr}
            />
          ) : (
            <LineByLineReadingView
              verses={verses}
              fontSize={readerSettings.fontSize}
              fontFamily={readerSettings.fontFamily}
              bookName={selectedBookName}
              bookAbbr={selectedBookAbbr}
              chapter={selectedChapter}
              translationAbbr={activeTranslationAbbr}
            />
          )}

          {/* Navegador secuencial de capítulos */}
          <ChapterNavigator
            selectedBookName={selectedBookName}
            selectedBookAbbr={selectedBookAbbr}
            selectedChapter={selectedChapter}
            onPrevChapter={onPrevChapter}
            onNextChapter={onNextChapter}
            translationAbbr={activeTranslationAbbr}
          />
        </>
      )}
    </div>
  );
};
