'use client';

import React, { useState } from 'react';
import { VerseList, useVerses } from '../features/verses';
import { BookSelector, useBooks } from '../features/books';
import { useTranslations } from '../features/translations';
import {
  ParallelViewGrid,
  useParallelVerses,
  ParallelVerseRow,
  BibleStudyMode,
} from '../features/parallel-view';
import { TextualDiffModal, VerseComparisonData } from '../features/textual-diff';
import { InterlinearView } from '../features/interlinear';
import { LiteraryAnalysisView } from '../features/literary-analysis';
import { LexiconView } from '../features/lexicons';
import { GrammarSearchDashboard } from '../features/grammar-search';
import { AtlasDashboard } from '../features/atlas';
import { TimelineDashboard } from '../features/timeline';
import { ArchaeologyFeedDashboard } from '../features/archaeology-feed';
import { BibleHeaderNav } from './BibleHeaderNav';

export function BibleStudyWorkspace() {
  const [studyMode, setStudyMode] = useState<BibleStudyMode>('standard');
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [activeDiffData, setActiveDiffData] = useState<VerseComparisonData | null>(null);
  const [rowVersesMap, setRowVersesMap] = useState<
    Record<number, { text: string; name: string; abbreviation: string }>
  >({});

  // Hook de traducción y versículos estándar
  const {
    verses,
    loading: versesLoading,
    error: versesError,
    selectedBookId,
    setSelectedBookId,
    selectedTranslationId,
    setSelectedTranslationId,
    selectedChapter,
    setSelectedChapter,
    readerSettings,
    setLayoutMode,
    setFontSize,
    setFontFamily,
    toggleVerseNumbers,
    nextChapter,
    prevChapter,
  } = useVerses();

  const { books } = useBooks();
  const { translations } = useTranslations();

  const selectedBook = books.find((b) => b.id === selectedBookId);
  const activeTranslation = translations.find((t) => t.id === selectedTranslationId);

  // Hook para gestión de columnas y filas paralelas
  const {
    columns,
    rows,
    loading: parallelLoading,
    error: parallelError,
    addColumn,
    removeColumn,
    updateColumnTranslation,
  } = useParallelVerses(
    selectedBookId,
    selectedChapter,
    selectedTranslationId ? [selectedTranslationId, selectedTranslationId === 1 ? 2 : 1] : [1, 2],
  );

  const handleOpenDiffModal = (row: ParallelVerseRow) => {
    const validTranslations = Object.values(row.translations).filter(
      (v): v is NonNullable<typeof v> => v !== null,
    );

    if (validTranslations.length < 2) {
      return;
    }

    const tA = validTranslations[0];
    const tB = validTranslations[1];

    const map: Record<number, { text: string; name: string; abbreviation: string }> = {};
    for (const item of validTranslations) {
      map[item.translationId] = {
        text: item.text,
        name: item.translationName,
        abbreviation: item.translationAbbreviation,
      };
    }

    setRowVersesMap(map);
    setActiveDiffData({
      bookName: tA.bookName,
      chapter: tA.chapter,
      verseNumber: row.verseNumber,
      translationA: {
        id: tA.translationId,
        abbreviation: tA.translationAbbreviation,
        name: tA.translationName,
        text: tA.text,
      },
      translationB: {
        id: tB.translationId,
        abbreviation: tB.translationAbbreviation,
        name: tB.translationName,
        text: tB.text,
      },
    });
    setDiffModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navegación Superior Fija en 1 Sola Línea */}
      <BibleHeaderNav
        studyMode={studyMode}
        onChangeStudyMode={setStudyMode}
        selectedTranslationId={selectedTranslationId}
        onSelectTranslation={setSelectedTranslationId}
        columnCount={columns.length}
        availableTranslations={translations}
        activeTranslationIds={columns.map((c) => c.translationId)}
        onAddColumn={addColumn}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-20 space-y-4">
        {/* Selector de libros en modos que lo requieren */}
        {studyMode !== 'standard' && (
          <section className="border border-accents-2 rounded-xl bg-background p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-accents-5">
                Libro Seleccionado: <span className="text-foreground">{selectedBook?.name || 'Todos'}</span>
              </h2>
              <span className="text-[11px] font-mono text-accents-4">
                Antiguo y Nuevo Testamento
              </span>
            </div>
            <BookSelector
              selectedBookId={selectedBookId}
              onSelectBook={setSelectedBookId}
            />
          </section>
        )}

        {/* Sección de Estudio / Lectura */}
        <section className="space-y-3">
          {studyMode === 'parallel' ? (
            <ParallelViewGrid
              columns={columns}
              rows={rows}
              loading={parallelLoading}
              error={parallelError}
              availableTranslations={translations}
              onSelectTranslation={updateColumnTranslation}
              onRemoveColumn={removeColumn}
              onCompareRow={handleOpenDiffModal}
            />
          ) : studyMode === 'interlinear' ? (
            <InterlinearView selectedBookAbbr={selectedBook?.abbreviation} />
          ) : studyMode === 'literary' ? (
            <LiteraryAnalysisView />
          ) : studyMode === 'lexicon' ? (
            <LexiconView />
          ) : studyMode === 'grammar-search' ? (
            <GrammarSearchDashboard />
          ) : studyMode === 'atlas' ? (
            <AtlasDashboard />
          ) : studyMode === 'timeline' ? (
            <TimelineDashboard />
          ) : studyMode === 'archaeology' ? (
            <ArchaeologyFeedDashboard />
          ) : (
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
              onSelectBook={setSelectedBookId}
              selectedBookName={selectedBook?.name}
              selectedBookAbbr={selectedBook?.abbreviation}
              selectedChapter={selectedChapter}
              onSelectChapter={setSelectedChapter}
              onPrevChapter={prevChapter}
              onNextChapter={nextChapter}
              activeTranslationName={activeTranslation?.name}
              activeTranslationAbbr={activeTranslation?.abbreviation}
            />
          )}
        </section>
      </main>

      {/* Modal de análisis de variantes textuales */}
      <TextualDiffModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        initialData={activeDiffData}
        availableTranslations={translations}
        allVersesByTranslation={rowVersesMap}
      />

      {/* Footer */}
      <footer className="border-t border-accents-2 w-full py-6 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-accents-4">
          <div>Jorge Doicela &copy; {new Date().getFullYear()} • Biblia Modular</div>
          <div className="flex gap-4">
            <a href="/bible" className="hover:text-foreground transition-colors duration-150">
              Presentación
            </a>
            <span className="text-accents-2">|</span>
            <span className="hover:text-foreground transition-colors duration-150 cursor-default">
              Sagradas Escrituras
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
