'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Translation } from '../../translations/hooks/useTranslations';
import { BibleSelect, BibleSelectOption } from '../../../components/BibleSelect';

interface ParallelColumnHeaderProps {
  columnId: string;
  columnIndex: number;
  currentTranslationId: number;
  availableTranslations: Translation[];
  canRemove: boolean;
  onSelectTranslation: (columnId: string, translationId: number) => void;
  onRemoveColumn: (columnId: string) => void;
}

export const ParallelColumnHeader: React.FC<ParallelColumnHeaderProps> = ({
  columnId,
  columnIndex,
  currentTranslationId,
  availableTranslations,
  canRemove,
  onSelectTranslation,
  onRemoveColumn,
}) => {
  const t = useTranslations('Parallel');
  const currentTranslation = availableTranslations.find(
    (tr) => tr.id === currentTranslationId,
  );

  const options: BibleSelectOption<number>[] = availableTranslations.map((tr) => ({
    value: tr.id,
    label: tr.name,
    badge: tr.abbreviation,
  }));

  return (
    <div className="p-3 bg-background/95 backdrop-blur-md border-r border-accents-2 last:border-r-0 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accents-1 border border-accents-2 text-[10px] font-mono font-bold flex items-center justify-center text-accents-5">
          {columnIndex + 1}
        </span>

        {/* Selector de versión para esta columna */}
        <BibleSelect<number>
          value={currentTranslationId}
          onChange={(newId) => onSelectTranslation(columnId, newId)}
          options={options}
          className="max-w-[150px] sm:max-w-[200px]"
          size="xs"
          ariaLabel={t('selectTranslationAria', { index: columnIndex + 1 })}
        />
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {currentTranslation?.language && (
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-accents-1 text-accents-4 border border-accents-2">
            {currentTranslation.language}
          </span>
        )}

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemoveColumn(columnId)}
            className="p-1 rounded-md text-accents-4 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            title={t('closeColumnTooltip')}
            aria-label={t('closeColumn')}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
