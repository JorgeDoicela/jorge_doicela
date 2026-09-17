'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ParallelViewGrid,
  useParallelContext,
  ParallelVerseRow,
  TextualDiffModal,
  VerseComparisonData,
} from '../../../features/parallel-view';
import { useBiblePassage } from '../../../shared/context';
import { BiblePassageToolbar } from '../../../widgets/bible-passage-toolbar';

export default function ParallelStudyPage() {
  const t = useTranslations('Parallel');
  const {
    translations,
    selectedBookId,
    selectedChapter,
    selectedBook,
    openInspectorWithVerse,
  } = useBiblePassage();

  const parallel = useParallelContext();
  const {
    columns,
    rows,
    loading: parallelLoading,
    error: parallelError,
    removeColumn,
    updateColumnTranslation,
    addColumn,
    setSelectedVerseNumber,
  } = parallel;

  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [activeDiffData, setActiveDiffData] = useState<VerseComparisonData | null>(null);
  const [rowVersesMap, setRowVersesMap] = useState<
    Record<number, { text: string; name: string; abbreviation: string }>
  >({});

  const nextAvailableTranslation = translations.find(
    (t) => !columns.some((c) => c.translationId === t.id),
  ) || translations[0];

  const handleInspectRow = (row: ParallelVerseRow) => {
    setSelectedVerseNumber(row.verseNumber);
    const validTranslations = Object.values(row.translations).filter(
      (v): v is NonNullable<typeof v> => v !== null,
    );
    const firstValid = validTranslations[0];
    const text = firstValid?.text || '';
    const bName = firstValid?.bookName || selectedBook?.name || 'Génesis';

    openInspectorWithVerse({
      bookId: selectedBookId || 1,
      bookName: bName,
      chapter: selectedChapter || 1,
      verseNumber: row.verseNumber,
      text: text,
    });
  };

  const handleOpenDiffModal = (row: ParallelVerseRow) => {
    const validTranslations = Object.values(row.translations).filter(
      (v): v is NonNullable<typeof v> => v !== null,
    );

    if (validTranslations.length < 2) return;

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
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Barra de Pasaje y Acciones de Paralelo */}
      <BiblePassageToolbar
        rightBadge={
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-accents-4 bg-accents-1 px-2.5 py-1 rounded-lg border border-accents-2">
              {columns.length === 1
                ? t('parallelCountSingle')
                : t('parallelCountMulti', { count: columns.length })}
            </span>
            {columns.length < 4 && nextAvailableTranslation && (
              <button
                type="button"
                onClick={() => addColumn(nextAvailableTranslation.id)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-accents-2 bg-background hover:border-foreground text-foreground transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                title={t('addVersionTooltip')}
              >
                <svg className="w-3.5 h-3.5 text-accents-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>{t('addVersionBtn')}</span>
              </button>
            )}
          </div>
        }
      />

      {/* Grid de Columnas Paralelas */}
      <section className="space-y-3">
        <ParallelViewGrid
          columns={columns}
          rows={rows}
          loading={parallelLoading}
          error={parallelError}
          availableTranslations={translations}
          onSelectTranslation={updateColumnTranslation}
          onRemoveColumn={removeColumn}
          onCompareRow={handleOpenDiffModal}
          onInspectRow={handleInspectRow}
        />
      </section>

      {/* Modal de Diferencias Textuales */}
      <TextualDiffModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        initialData={activeDiffData}
        availableTranslations={translations}
        allVersesByTranslation={rowVersesMap}
      />
    </div>
  );
}
