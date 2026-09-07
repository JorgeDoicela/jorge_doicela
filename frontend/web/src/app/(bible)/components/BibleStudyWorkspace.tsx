'use client';

import React, { useState } from 'react';
import { useTranslations as useI18n } from 'next-intl';
import { VerseList, useVerses } from '../features/verses';
import { UnifiedPassagePicker, useBooks } from '../features/books';
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
import { WordStudyView } from './WordStudyView';
import { HistoricalContextView } from './HistoricalContextView';
import { BibleHeaderNav } from './BibleHeaderNav';

export function BibleStudyWorkspace() {
  const tStudy = useI18n('StudyLayout');
  const tParallel = useI18n('Parallel');
  const tInterlinear = useI18n('Interlinear');
  const tNav = useI18n('Nav');

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
    selectedTranslationId ? [selectedTranslationId, selectedTranslationId === 3 ? 5 : 3] : [3, 5],
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

  const handlePassageSelect = (bookId: number, chapter: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(chapter);
  };

  const isPassageBasedMode = ['parallel', 'interlinear', 'literary', 'grammar-search'].includes(studyMode);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navegación Superior Fija en 1 Sola Línea */}
      <BibleHeaderNav />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-20 space-y-4">
        {/* Barra de Pasaje Compacta para Modos de Estudio de Texto */}
        {isPassageBasedMode && (
          <section className="border border-accents-2 rounded-xl bg-background p-2 sm:p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-accents-5 hidden sm:inline">
                Pasaje Activo:
              </span>
              <UnifiedPassagePicker
                books={books}
                selectedBookId={selectedBookId}
                selectedChapter={selectedChapter}
                onSelectPassage={handlePassageSelect}
                onPrevChapter={prevChapter}
                onNextChapter={nextChapter}
                size="sm"
              />
            </div>

            <div className="flex items-center gap-2">
              {studyMode === 'parallel' && (
                <span className="text-[11px] font-mono text-accents-4 bg-accents-1 px-2.5 py-1 rounded-lg border border-accents-2">
                  {columns.length === 1
                    ? tParallel('parallelCountSingle')
                    : tParallel('parallelCountMulti', { count: columns.length })}
                </span>
              )}
              {studyMode === 'interlinear' && (
                <span className="text-[11px] font-mono text-amber-500/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {selectedBook?.testament === 'NT' ? tInterlinear('activeOriginalBadgeNt') : tInterlinear('activeOriginalBadgeOt')}
                </span>
              )}
              {studyMode === 'literary' && (
                <span className="text-[11px] font-mono text-emerald-500/90 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {tNav('literary')}
                </span>
              )}
              {studyMode === 'grammar-search' && (
                <span className="text-[11px] font-mono text-cyan-500/90 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  {tNav('wordStudy')}
                </span>
              )}
            </div>
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
          ) : studyMode === 'word-study' ? (
            <WordStudyView />
          ) : studyMode === 'historical-context' ? (
            <HistoricalContextView />
          ) : studyMode === 'literary' ? (
            <LiteraryAnalysisView />
          ) : studyMode === 'lexicon' ? (
            <WordStudyView initialSubTab="lexicon" />
          ) : studyMode === 'grammar-search' ? (
            <WordStudyView initialSubTab="morphology" />
          ) : studyMode === 'atlas' ? (
            <HistoricalContextView initialSubTab="atlas" />
          ) : studyMode === 'timeline' ? (
            <HistoricalContextView initialSubTab="timeline" />
          ) : studyMode === 'archaeology' ? (
            <HistoricalContextView initialSubTab="archaeology" />
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
              onSelectPassage={handlePassageSelect}
              onSelectBook={setSelectedBookId}
              selectedBookName={selectedBook?.name}
              selectedBookAbbr={selectedBook?.abbreviation}
              selectedChapter={selectedChapter}
              onSelectChapter={setSelectedChapter}
              onPrevChapter={prevChapter}
              onNextChapter={nextChapter}
              selectedTranslationId={selectedTranslationId}
              onSelectTranslation={setSelectedTranslationId}
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
          <div>{tStudy('title', { year: new Date().getFullYear().toString() })}</div>
          <div className="flex gap-4">
            <a href="/bible" className="hover:text-foreground transition-colors duration-150">
              {tStudy('presentation')}
            </a>
            <span className="text-accents-2">|</span>
            <span className="hover:text-foreground transition-colors duration-150 cursor-default">
              {tStudy('holyScriptures')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
