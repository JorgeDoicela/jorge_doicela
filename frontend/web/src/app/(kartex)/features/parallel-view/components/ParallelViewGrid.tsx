'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, Columns2, Rows3 } from 'lucide-react';
import { ParallelColumn, ParallelVerseRow } from '../types';
import { ParallelColumnHeader } from './ParallelColumnHeader';
import { Translation } from '../../../entities/translations';
import { OngoingExpansionNotice } from '../../../shared/ui';
import { useReaderAppearanceSettings } from '../../verses/hooks/useReaderAppearanceSettings';
import { getReaderFontClass } from '../../verses/config/readerFonts';

interface ParallelViewGridProps {
  columns: ParallelColumn[];
  rows: ParallelVerseRow[];
  loading: boolean;
  error: string | null;
  availableTranslations: Translation[];
  onSelectTranslation: (columnId: string, translationId: number) => void;
  onRemoveColumn: (columnId: string) => void;
  onCompareRow?: (row: ParallelVerseRow) => void;
  onInspectRow?: (row: ParallelVerseRow) => void;
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
  onInspectRow,
}) => {
  const t = useTranslations('Parallel');
  const [mobileLayout, setMobileLayout] = useState<'stacked' | 'columns'>('stacked');
  const { settings: readerSettings } = useReaderAppearanceSettings();
  const readerFontClass = getReaderFontClass(readerSettings.fontFamily);

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-accents-2 bg-background overflow-hidden shadow-xs">
      {/* Switcher de visualización móvil: Apilado vs Columnas deslizantes */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-border/80 bg-accents-1/40">
        <span className="text-[11px] font-mono font-medium text-accents-5">
          Vista móvil
        </span>
        <div className="flex items-center rounded-full border border-border/80 p-0.5 bg-background shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileLayout('stacked')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              mobileLayout === 'stacked'
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            <Rows3 className="w-3 h-3" />
            <span>Apilado</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileLayout('columns')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              mobileLayout === 'columns'
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            <Columns2 className="w-3 h-3" />
            <span>Columnas</span>
          </button>
        </div>
      </div>
      {/* 1. MODO APILADO ERGONÓMICO EN MÓVILES (< md) */}
      {!loading && rows.length > 0 && mobileLayout === 'stacked' && (
        <div className="md:hidden divide-y divide-border/60">
          {rows.map((row) => (
            <div key={row.verseNumber} className="p-3.5 space-y-2.5 bg-background">
              {/* Encabezado del versículo con acciones inmediatas */}
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <span className="text-xs font-mono font-bold text-foreground bg-accents-2 px-2.5 py-0.5 rounded-full border border-border/70 shadow-2xs">
                  v. {row.verseNumber}
                </span>
                <div className="flex items-center gap-1.5">
                  {onCompareRow && (
                    <button
                      type="button"
                      onClick={() => onCompareRow(row)}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-inner-card hover:bg-accents-2 text-foreground border border-border/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      ± {t('variants')}
                    </button>
                  )}
                  {onInspectRow && (
                    <button
                      type="button"
                      onClick={() => onInspectRow(row)}
                      className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-inner-card hover:bg-accents-2 text-foreground border border-border/80 shadow-2xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <span>Exégesis</span>
                      <Sparkles className="w-3 h-3 text-primary" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tarjetas apiladas por versión */}
              <div className="space-y-2">
                {columns.map((col) => {
                  const verseData = row.translations[col.translationId];
                  return (
                    <div
                      key={col.id}
                      className="p-3 rounded-xl border border-border/70 bg-card-bg/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-xs uppercase text-foreground bg-accents-2 px-2 py-0.5 rounded-full border border-border/70 shadow-2xs">
                          {verseData?.translationAbbreviation || '---'}
                        </span>
                        <span className="text-accents-4 text-[10px] truncate max-w-[200px]">
                          {verseData?.translationName}
                        </span>
                      </div>
                      {verseData ? (
                        <p className={`text-sm ${readerFontClass} leading-relaxed text-foreground/90`}>
                          {verseData.text}
                        </p>
                      ) : (
                        <p className="text-xs italic text-accents-4 py-1">
                          {t('verseUnavailable')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. MODO TABULAR EN ESCRITORIO O COLUMNAS EN MÓVIL */}
      <div
        className={`overflow-x-auto scrollbar-none ${
          mobileLayout === 'stacked' ? 'hidden md:block' : 'block'
        }`}
        style={{ scrollbarWidth: 'none' }}
      >
        <div style={{ minWidth: columns.length > 1 ? `${columns.length * 280}px` : '100%' }}>
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
                contextTitle={t('noVersesTitle')}
                contextDescription={t('noVersesDesc')}
                className="border-0 shadow-none bg-transparent"
              />
            </div>
          )}

          {/* Filas alineadas por versículo en columnas */}
          {!loading && rows.length > 0 && (
            <div className="divide-y divide-accents-2">
              {rows.map((row) => (
                <div
                  key={row.verseNumber}
                  className="group hover:bg-accents-1/40 transition-colors duration-150 relative"
                >
                  {/* Acciones flotantes por fila */}
                  <div className="absolute top-2 left-2 z-10 hidden md:flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    {onInspectRow ? (
                      <button
                        type="button"
                        onClick={() => onInspectRow(row)}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-inner-card border border-border/80 text-foreground hover:bg-accents-2 transition-all shadow-2xs flex items-center gap-1 cursor-pointer active:scale-95"
                        title={t('inspectVerseRight')}
                      >
                        <span>v.{row.verseNumber}</span>
                        <Sparkles className="w-2.5 h-2.5 text-primary" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-inner-card border border-border/80 text-foreground shadow-2xs">
                        v.{row.verseNumber}
                      </span>
                    )}

                    {onCompareRow && (
                      <button
                        type="button"
                        onClick={() => onCompareRow(row)}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-inner-card hover:bg-accents-2 text-foreground border border-border/80 shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        title={t('variantsTooltip', { verse: row.verseNumber })}
                      >
                        <span className="font-mono font-bold text-blue-500">±</span>
                        <span>{t('variants')}</span>
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
                            {onInspectRow ? (
                              <button
                                type="button"
                                onClick={() => onInspectRow(row)}
                                className="text-[11px] font-mono font-semibold text-foreground flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                                title={t('inspectVerse')}
                              >
                                <span>v.{row.verseNumber} ({verseData?.translationAbbreviation || '---'})</span>
                                <Sparkles className="w-3 h-3 text-primary" />
                              </button>
                            ) : (
                              <span className="text-[11px] font-mono font-semibold text-foreground">
                                v.{row.verseNumber} ({verseData?.translationAbbreviation || '---'})
                              </span>
                            )}
                            {onCompareRow && (
                              <button
                                type="button"
                                onClick={() => onCompareRow(row)}
                                className="text-[10px] font-medium px-2 py-0.5 rounded bg-accents-1 border border-accents-2 text-foreground cursor-pointer"
                              >
                                ± {t('variants')}
                              </button>
                            )}
                          </div>

                          {verseData ? (
                            <div className="space-y-2">
                              <p className={`text-foreground/90 ${readerFontClass} md:text-[15px] leading-relaxed selection:bg-blue-500/20`}>
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
                              {t('verseUnavailable')}
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
      </div>
    </div>
  );
};
