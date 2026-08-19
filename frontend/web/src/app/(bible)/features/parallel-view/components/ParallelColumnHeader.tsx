'use client';

import React from 'react';
import { Translation } from '../../translations/hooks/useTranslations';

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
  const currentTranslation = availableTranslations.find(
    (t) => t.id === currentTranslationId,
  );

  return (
    <div className="sticky top-14 z-20 p-3 bg-background/95 backdrop-blur-md border-b border-accents-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accents-1 border border-accents-2 text-[10px] font-mono font-bold flex items-center justify-center text-accents-5">
          {columnIndex + 1}
        </span>

        {/* Selector de versión para esta columna */}
        <select
          value={currentTranslationId}
          onChange={(e) =>
            onSelectTranslation(columnId, parseInt(e.target.value, 10))
          }
          className="bg-accents-1 hover:bg-accents-2 border border-accents-2 rounded-md px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors cursor-pointer truncate max-w-[180px]"
          aria-label={`Seleccionar traducción para columna ${columnIndex + 1}`}
        >
          {availableTranslations.map((t) => (
            <option key={t.id} value={t.id} className="bg-background text-foreground">
              {t.abbreviation} - {t.name}
            </option>
          ))}
        </select>
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
            title="Cerrar esta columna"
            aria-label="Cerrar columna"
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
