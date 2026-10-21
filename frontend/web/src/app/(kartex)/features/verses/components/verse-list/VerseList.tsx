'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
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
import { OngoingExpansionNotice } from '../../../../shared/ui';
import { useReaderKeybindings } from '../../hooks/useReaderKeybindings';
import { X, Minimize2, Sparkles, BookOpen } from 'lucide-react';

interface VerseListProps {
  verses: Verse[];
  loading: boolean;
  error: string | null;
  readerSettings: ReaderSettings;
  onLayoutModeChange: (mode: ReaderLayoutMode) => void;
  onFontSizeChange: (size: ReaderFontSize) => void;
  onFontFamilyChange: (family: ReaderFontFamily) => void;
  onToggleFocusMode?: () => void;
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
  onToggleFocusMode,
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
  const tToolbar = useTranslations('Toolbar');
  const tVerses = useTranslations('Verses');

  // Activar atajos de teclado para navegación, zoom de tipografía y modo enfoque
  useReaderKeybindings({
    onPrevChapter,
    onNextChapter: () => onNextChapter(),
    onToggleLayoutMode: () => {
      onLayoutModeChange(
        readerSettings.layoutMode === 'continuous' ? 'verse-by-verse' : 'continuous',
      );
    },
    onToggleFocusMode,
    onExitFocusMode: () => {
      if (readerSettings.focusMode) onToggleFocusMode?.();
    },
    fontSize: readerSettings.fontSize,
    onFontSizeChange,
  });

  const readingContent = (
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
  );

  // MODO ENFOQUE INMERSIVO A PANTALLA COMPLETA
  if (readerSettings.focusMode) {
    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-background text-foreground transition-colors duration-200 px-4 sm:px-8 md:px-12 lg:px-24 py-6 flex flex-col items-center animate-fade-in"
      >
        {/* Barra Flotante Superior Minimalista de Modo Enfoque */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-8 pb-3 border-b border-border/40 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {selectedBookName} {selectedChapter}
            </span>
            {activeTranslationAbbr && (
              <span className="px-1.5 py-0.5 rounded bg-accents-2 text-foreground text-[10px]">
                {activeTranslationAbbr}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Salir de modo enfoque */}
            <button
              type="button"
              onClick={onToggleFocusMode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm text-xs"
              title={tVerses('exitFocusEsc')}
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>{tVerses('exitEsc')}</span>
            </button>
          </div>
        </div>

        {/* Contenido en ancho óptimo de lectura */}
        <div className="w-full max-w-4xl space-y-4">
          {loading && (
            <div className="w-full rounded-2xl border border-border/60 p-8 sm:p-12 space-y-4 animate-pulse">
              <div className="h-6 w-48 bg-accents-2 rounded mx-auto mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-accents-2 rounded w-full" />
                <div className="h-4 bg-accents-2 rounded w-11/12" />
                <div className="h-4 bg-accents-2 rounded w-full" />
              </div>
            </div>
          )}

          {!loading && !error && verses.length > 0 && readingContent}
        </div>
      </div>
    );
  }

  // MODO ESTÁNDAR INTEGRADO EN EL WORKSPACE
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Barra de herramientas integrada del lector */}
      <ReaderToolbar
        readerSettings={readerSettings}
        onLayoutModeChange={onLayoutModeChange}
        onFontSizeChange={onFontSizeChange}
        onFontFamilyChange={onFontFamilyChange}
        onToggleFocusMode={onToggleFocusMode}
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
      {!loading && !error && verses.length > 0 && readingContent}
    </div>
  );
};
