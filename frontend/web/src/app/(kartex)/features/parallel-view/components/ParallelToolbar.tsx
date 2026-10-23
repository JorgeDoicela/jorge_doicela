'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Translation } from '../../../entities/translations';

export type KartexStudyMode =
  | 'standard'
  | 'parallel'
  | 'interlinear'
  | 'word-study'
  | 'atlas'
  | 'timeline'
  | 'archaeology'
  | 'evangelism';

interface ParallelToolbarProps {
  studyMode: KartexStudyMode;
  onChangeStudyMode: (mode: KartexStudyMode) => void;
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
        <div className="inline-flex flex-wrap p-0.5 rounded-full bg-inner-card border border-border/80 gap-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => onChangeStudyMode('standard')}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 ${
              studyMode === 'standard'
                ? 'bg-foreground text-background shadow-2xs font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            {t('modes.standard')}
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('parallel')}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 ${
              studyMode === 'parallel'
                ? 'bg-foreground text-background shadow-2xs font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            {t('modes.parallel')}
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('interlinear')}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              studyMode === 'interlinear'
                ? 'bg-foreground text-background shadow-2xs font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {t('modes.interlinear')}
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('word-study')}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              studyMode === 'word-study'
                ? 'bg-foreground text-background shadow-2xs font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            {t('modes.wordStudy')}
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('atlas')}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              studyMode === 'atlas' || studyMode === 'timeline' || studyMode === 'archaeology'
                ? 'bg-foreground text-background shadow-2xs font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {t('modes.historical')}
          </button>
        </div>

        {studyMode === 'parallel' && (
          <span className="hidden sm:inline-flex text-[11px] font-mono text-accents-4 px-2.5 py-0.5 rounded-full border border-border/80 bg-inner-card/90 shadow-2xs">
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
              className="px-3.5 py-1.5 text-xs font-medium rounded-full border border-border/80 bg-inner-card/90 hover:bg-inner-card hover:border-accents-4 text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
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

      {/* Indicador para vista de Análisis de Palabra */}
      {studyMode === 'word-study' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          {t('indicators.wordStudy')}
        </div>
      )}

      {/* Indicador para vista de Contexto Histórico */}
      {(studyMode === 'atlas' || studyMode === 'timeline' || studyMode === 'archaeology') && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          {t('indicators.historical')}
        </div>
      )}
    </div>
  );
};




