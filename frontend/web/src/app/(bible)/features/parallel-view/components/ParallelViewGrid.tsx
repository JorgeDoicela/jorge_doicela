'use client';

import React from 'react';
import { ParallelColumn, ParallelVerseRow } from '../types';
import { ParallelColumnHeader } from './ParallelColumnHeader';
import { Translation } from '../../translations/hooks/useTranslations';
import { OngoingExpansionNotice } from '../../../components/OngoingExpansionNotice';

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
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-accents-2 bg-background overflow-hidden shadow-xs">
      {/* Cabecera pegajosa con selectores de versión */}
      <div
        className="grid border-b border-accents-2 bg-background/95 backdrop-blur-md sticky top-0 z-20"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((col, idx) => (
          <ParallelColumnHeader
            key={col.id}
            columnId={col.id}
            columnIndex={idx}
            currentTranslationId={col.translationId}
            availableTranslations={availableTranslations}
            onSelectTranslation={onSelectTranslation}
            onRemoveColumn={onRemoveColumn}
            canRemove={columns.length > 2}
          />
        ))}
      </div>

      {/* Esqueleto de carga */}
      {loading && (
        <div className="p-6 space-y-4 animate-pulse">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
            >
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

      {/* Estado sin versículos con Aviso de Expansión */}
      {!loading && rows.length === 0 && (
        <div className="p-8 sm:p-12">
          <OngoingExpansionNotice
            contextTitle="No hay versículos sincronizados para este capítulo"
            contextDescription="Esta plataforma es nueva y estoy sincronizando versículo por versículo entre las diversas traducciones. Me esfuerzo día a día para brindarte una herramienta de comparación fiel y de gran calidad."
            className="border-0 shadow-none bg-transparent"
          />
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

              <div
                className="grid divide-y md:divide-y-0 md:divide-x divide-accents-2"
                style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
              >
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
