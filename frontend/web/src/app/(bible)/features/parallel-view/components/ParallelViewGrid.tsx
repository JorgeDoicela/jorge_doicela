'use client';

import React from 'react';
import { ParallelColumn, ParallelVerseRow } from '../types';
import { ParallelColumnHeader } from './ParallelColumnHeader';
import { Translation } from '../../translations/hooks/useTranslations';

interface ParallelViewGridProps {
  columns: ParallelColumn[];
  rows: ParallelVerseRow[];
  loading: boolean;
  error: string | null;
  availableTranslations: Translation[];
  onSelectTranslation: (columnId: string, translationId: number) => void;
  onRemoveColumn: (columnId: string) => void;
  onCompareRow?: (row: ParallelVerseRow) => void;
}

export const ParallelViewGrid: React.FC<ParallelViewGridProps> = ({
  columns,
  rows,
  loading,
  error,
  availableTranslations,
  onSelectTranslation,
  onRemoveColumn,
  onCompareRow,
}) => {
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-xs font-mono text-center my-6">
        {error}
      </div>
    );
  }

  // Clases dinámicas de grid según cantidad de columnas
  const getGridColsClass = () => {
    switch (columns.length) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  return (
    <div className="w-full border border-accents-2 rounded-xl bg-background overflow-hidden shadow-sm">
      {/* Cabeceras fijas de cada columna */}
      <div className={`grid ${getGridColsClass()} divide-y md:divide-y-0 md:divide-x divide-accents-2 border-b border-accents-2`}>
        {columns.map((col, idx) => (
          <ParallelColumnHeader
            key={col.id}
            columnId={col.id}
            columnIndex={idx}
            currentTranslationId={col.translationId}
            availableTranslations={availableTranslations}
            canRemove={columns.length > 2}
            onSelectTranslation={onSelectTranslation}
            onRemoveColumn={onRemoveColumn}
          />
        ))}
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="p-6 space-y-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, rIdx) => (
            <div key={rIdx} className={`grid ${getGridColsClass()} gap-4 pt-4 border-t border-accents-1 first:border-0`}>
              {columns.map((col) => (
                <div key={col.id} className="space-y-2 p-3 rounded bg-accents-1/40">
                  <div className="h-4 w-12 bg-accents-2 rounded" />
                  <div className="h-3.5 w-full bg-accents-2 rounded" />
                  <div className="h-3.5 w-4/5 bg-accents-2 rounded" />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Estado sin versículos */}
      {!loading && rows.length === 0 && (
        <div className="py-16 px-6 text-center">
          <p className="text-accents-5 text-sm">
            No se encontraron versículos en común para las versiones seleccionadas.
          </p>
          <p className="text-accents-4 text-xs font-mono mt-1">
            Intenta seleccionar otro libro o capítulo con el selector superior.
          </p>
        </div>
      )}

      {/* Filas alineadas por versículo */}
      {!loading && rows.length > 0 && (
        <div className="divide-y divide-accents-2">
          {rows.map((row) => (
            <div
              key={row.verseNumber}
              className="group hover:bg-accents-1/40 transition-colors duration-150 relative"
            >
              {/* Acciones flotantes por fila */}
              <div className="absolute top-2 left-2 z-10 hidden md:flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-background border border-accents-2 text-accents-5 shadow-xs">
                  v.{row.verseNumber}
                </span>

                {onCompareRow && (
                  <button
                    type="button"
                    onClick={() => onCompareRow(row)}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-background hover:bg-accents-2 text-foreground border border-accents-2 shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    title={`Analizar variantes textuales del versículo ${row.verseNumber}`}
                  >
                    <span className="font-mono font-bold text-blue-500">±</span>
                    <span>Variantes</span>
                  </button>
                )}
              </div>

              <div className={`grid ${getGridColsClass()} divide-y md:divide-y-0 md:divide-x divide-accents-2`}>
                {columns.map((col) => {
                  const verseData = row.translations[col.translationId];
                  return (
                    <div
                      key={col.id}
                      className="p-4 sm:p-5 flex flex-col justify-between text-sm leading-relaxed relative pt-7 md:pt-8"
                    >
                      {/* Indicador en móviles */}
                      <div className="flex items-center justify-between mb-2 md:hidden">
                        <span className="text-[11px] font-mono font-semibold text-foreground">
                          v.{row.verseNumber} ({verseData?.translationAbbreviation || '---'})
                        </span>
                        {onCompareRow && (
                          <button
                            type="button"
                            onClick={() => onCompareRow(row)}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-accents-1 border border-accents-2 text-foreground"
                          >
                            ± Variantes
                          </button>
                        )}
                      </div>

                      {verseData ? (
                        <div className="space-y-2">
                          <p className="text-foreground/90 font-serif md:text-[15px] leading-relaxed selection:bg-blue-500/20">
                            {verseData.text}
                          </p>
                          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-accents-4">
                            <span>
                              {verseData.bookName} {verseData.chapter}:{verseData.verseNumber}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-accents-5">
                              {verseData.translationAbbreviation}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-accents-4 text-xs italic">
                          Versículo no disponible en esta traducción
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
