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
  onSelectBook?: (id: number | null) => void;
  selectedBookName?: string;
  selectedBookAbbr?: string;
  selectedChapter: number | null;
  onSelectChapter: (chapter: number | null) => void;
  onPrevChapter: () => void;
  onNextChapter: (maxChapters?: number) => void;
  activeTranslationName?: string;
  activeTranslationAbbr?: string;
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
  onSelectBook,
  selectedBookName,
  selectedBookAbbr,
  selectedChapter,
  onSelectChapter,
  onPrevChapter,
  onNextChapter,
  activeTranslationName,
  activeTranslationAbbr,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Barra de herramientas integrada del lector */}
      <ReaderToolbar
        readerSettings={readerSettings}
        onLayoutModeChange={onLayoutModeChange}
        onFontSizeChange={onFontSizeChange}
        onFontFamilyChange={onFontFamilyChange}
        onToggleVerseNumbers={onToggleVerseNumbers}
        books={books}
        selectedBookId={selectedBookId}
        onSelectBook={onSelectBook}
        selectedBookAbbr={selectedBookAbbr}
        selectedBookName={selectedBookName}
        selectedChapter={selectedChapter}
        onSelectChapter={onSelectChapter}
        verses={verses}
        activeTranslationName={activeTranslationName}
      />

      {/* Estado de carga con Skeleton editorial */}
      {loading && (
        <div className="w-full max-w-5xl mx-auto bg-background rounded-2xl border border-accents-2 p-8 sm:p-12 space-y-4 animate-pulse">
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

      {/* Estado de Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center">
          {error}
        </div>
      )}

      {/* Estado Vacío con Aviso de Plataforma Nueva y Crecimiento Continuo */}
      {!loading && !error && verses.length === 0 && (
        <OngoingExpansionNotice
          contextTitle={`Capítulo ${selectedChapter || ''} de ${selectedBookName || 'este libro'} en proceso de compilación`}
          contextDescription="Esta plataforma de estudio bíblico es nueva y por eso varios capítulos aún se encuentran en preparación. Me esfuerzo con dedicación por realizar un trabajo de máxima fidelidad y cuidado en cada libro."
          onExploreAvailable={() => onSelectChapter(1)}
          availableChapterText="Ir a Génesis 1"
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
