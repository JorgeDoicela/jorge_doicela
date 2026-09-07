'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Translation } from '../../translations/hooks/useTranslations';

export type BibleStudyMode =
  | 'standard'
  | 'parallel'
  | 'interlinear'
  | 'word-study'
  | 'literary'
  | 'historical-context'
  // Modos y aliases compatibles
  | 'lexicon'
  | 'grammar-search'
  | 'atlas'
  | 'timeline'
  | 'archaeology';

interface ParallelToolbarProps {
  studyMode: BibleStudyMode;
  onChangeStudyMode: (mode: BibleStudyMode) => void;
  columnCount: number;
  availableTranslations: Translation[];
  activeTranslationIds: number[];
  onAddColumn: (translationId: number) => void;
}

export const ParallelToolbar: React.FC<ParallelToolbarProps> = ({
  studyMode,
  onChangeStudyMode,
  columnCount,
  availableTranslations,
  activeTranslationIds,
  onAddColumn,
}) => {
  const t = useTranslations('Parallel');

  // Encontrar la primera traducción que no esté ya activa para sugerirla al añadir
  const nextAvailableTranslation = availableTranslations.find(
    (tr) => !activeTranslationIds.includes(tr.id),
  ) || availableTranslations[0];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-accents-2 bg-background/60 backdrop-blur-sm">
      {/* Selector de Modo de Estudio */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex flex-wrap p-1 rounded-lg bg-accents-1 border border-accents-2 gap-0.5">
          <button
            type="button"
            onClick={() => onChangeStudyMode('standard')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              studyMode === 'standard'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            {t('modes.standard')}
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('parallel')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'parallel'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {t('modes.parallel')}
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('interlinear')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'interlinear'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {t('modes.interlinear')}
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('word-study')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'word-study' || studyMode === 'lexicon' || studyMode === 'grammar-search'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            {t('modes.wordStudy')}
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('literary')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'literary'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('modes.literary')}
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('historical-context')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'historical-context' || studyMode === 'atlas' || studyMode === 'timeline' || studyMode === 'archaeology'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {t('modes.historical')}
          </button>
        </div>

        {studyMode === 'parallel' && (
          <span className="hidden sm:inline-flex text-[11px] font-mono text-accents-4 px-2 py-0.5 rounded border border-accents-2">
            {t('columnsCount', { count: columnCount })}
          </span>
        )}
      </div>

      {/* Controles para vista paralela */}
      {studyMode === 'parallel' && (
        <div className="flex items-center gap-2">
          {columnCount < 4 && nextAvailableTranslation && (
            <button
              type="button"
              onClick={() => onAddColumn(nextAvailableTranslation.id)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-accents-2 bg-background hover:bg-accents-1 text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              title={t('addColumnTooltip')}
            >
              <svg
                className="w-3.5 h-3.5 text-accents-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>{t('addColumn')}</span>
            </button>
          )}

          <div className="text-[11px] text-accents-4 font-mono hidden md:block">
            {t('verseByVerseAlignment')}
          </div>
        </div>
      )}

      {/* Indicador para vista interlineal */}
      {studyMode === 'interlinear' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          {t('indicators.interlinear')}
        </div>
      )}

      {/* Indicador para vista literaria */}
      {studyMode === 'literary' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          {t('indicators.literary')}
        </div>
      )}

      {/* Indicador para vista de Análisis de Palabra */}
      {(studyMode === 'word-study' || studyMode === 'lexicon' || studyMode === 'grammar-search') && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          {t('indicators.wordStudy')}
        </div>
      )}

      {/* Indicador para vista de Contexto Histórico */}
      {(studyMode === 'historical-context' || studyMode === 'atlas' || studyMode === 'timeline' || studyMode === 'archaeology') && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          {t('indicators.historical')}
        </div>
      )}
    </div>
  );
};




