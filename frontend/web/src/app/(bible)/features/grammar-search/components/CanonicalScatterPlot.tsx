'use client';

import React, { useState } from 'react';
import { LemmaCanonicalData, CanonicalGenre } from '../types';
import { CANONICAL_BOOKS } from '../../books/hooks/useBooks';
import { getChaptersForBookId } from '../../books/data/canonicCategories';
import { ScatterPlotScale } from '../hooks/useLemmaFrequency';

export const GENRE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Pentateuco: { bg: 'bg-amber-500/10 dark:bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/30', dot: '#f59e0b' },
  Históricos: { bg: 'bg-orange-500/10 dark:bg-orange-500/15', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-500/30', dot: '#f97316' },
  Poéticos: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/30', dot: '#10b981' },
  'Profetas Mayores': { bg: 'bg-indigo-500/10 dark:bg-indigo-500/15', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-500/30', dot: '#6366f1' },
  'Profetas Menores': { bg: 'bg-violet-500/10 dark:bg-violet-500/15', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-500/30', dot: '#8b5cf6' },
  Evangelios: { bg: 'bg-blue-500/10 dark:bg-blue-500/15', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500/30', dot: '#3b82f6' },
  Hechos: { bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-500/30', dot: '#06b6d4' },
  'Epístolas Paulinas': { bg: 'bg-purple-500/10 dark:bg-purple-500/15', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500/30', dot: '#a855f7' },
  'Epístolas Generales': { bg: 'bg-rose-500/10 dark:bg-rose-500/15', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-500/30', dot: '#f43f5e' },
  Apocalipsis: { bg: 'bg-red-500/10 dark:bg-red-500/15', text: 'text-red-700 dark:text-red-400', border: 'border-red-500/30', dot: '#ef4444' },
};

interface CanonicalScatterPlotProps {
  lemmaData: LemmaCanonicalData;
  scale: ScatterPlotScale;
  onToggleScale: (scale: ScatterPlotScale) => void;
}

export const CanonicalScatterPlot: React.FC<CanonicalScatterPlotProps> = ({
  lemmaData,
  scale,
  onToggleScale,
}) => {
  const [hoveredBookAbbr, setHoveredBookAbbr] = useState<string | null>(null);

  // Obtener el valor máximo para el escalado
  const maxCount = Math.max(
    ...CANONICAL_BOOKS.map((b) => lemmaData.distributionByBook[b.abbreviation] || 0),
    1,
  );

  const getYPosition = (count: number) => {
    const height = 180;
    const paddingBottom = 25;
    const paddingTop = 20;
    const availableHeight = height - paddingTop - paddingBottom;

    if (count === 0) return height - paddingBottom;

    if (scale === 'logarithmic') {
      const logMax = Math.log(maxCount + 1);
      const logVal = Math.log(count + 1);
      const ratio = logVal / logMax;
      return height - paddingBottom - ratio * availableHeight;
    } else {
      const ratio = count / maxCount;
      return height - paddingBottom - ratio * availableHeight;
    }
  };

  const getRadius = (count: number) => {
    if (count === 0) return 2.5;
    if (scale === 'logarithmic') {
      return 3.5 + (Math.log(count + 1) / Math.log(maxCount + 1)) * 7;
    }
    return 3.5 + (count / maxCount) * 8;
  };

  const hoveredBook = CANONICAL_BOOKS.find((b) => b.abbreviation === hoveredBookAbbr);
  const hoveredCount = hoveredBook ? lemmaData.distributionByBook[hoveredBook.abbreviation] || 0 : 0;
  const hoveredPercentage =
    lemmaData.totalOccurrences > 0
      ? ((hoveredCount / lemmaData.totalOccurrences) * 100).toFixed(1)
      : '0.0';

  const genresList: CanonicalGenre[] = [
    'Pentateuco',
    'Históricos',
    'Poéticos',
    'Profetas Mayores',
    'Profetas Menores',
    'Evangelios',
    'Hechos',
    'Epístolas Paulinas',
    'Epístolas Generales',
    'Apocalipsis',
  ];

  return (
    <div className="p-4 sm:p-6 rounded-xl border border-accents-2 bg-background space-y-4 shadow-xs">
      {/* Header del Gráfico */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-accents-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Gráfico de Dispersión Canónico (Canon Scatter Plot)
          </h3>
          <p className="text-[11px] text-accents-4 font-mono">
            Distribución cuantitativa de &quot;{lemmaData.originalScript}&quot; ({lemmaData.transliteration}) a lo largo de los 66 libros
          </p>
        </div>

        {/* Selector de Escala */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-accents-1 border border-accents-2">
          <span className="text-[10px] font-mono text-accents-4 px-1.5">Escala:</span>
          <button
            type="button"
            onClick={() => onToggleScale('linear')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
              scale === 'linear'
                ? 'bg-background text-foreground font-bold shadow-xs'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            Lineal
          </button>
          <button
            type="button"
            onClick={() => onToggleScale('logarithmic')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
              scale === 'logarithmic'
                ? 'bg-background text-foreground font-bold shadow-xs'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            Logarítmica (log)
          </button>
        </div>
      </div>

      {/* Área del Gráfico SVG Interactivo */}
      <div className="relative w-full overflow-x-auto pb-2">
        <div className="min-w-[760px] relative">
          <svg viewBox="0 0 760 210" className="w-full h-auto overflow-visible select-none">
            {/* Fondo de rejilla horizontal */}
            <line x1="30" y1="20" x2="745" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
            <line x1="30" y1="75" x2="745" y2="75" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
            <line x1="30" y1="130" x2="745" y2="130" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
            <line x1="30" y1="185" x2="745" y2="185" stroke="currentColor" strokeOpacity="0.15" />

            {/* Separador vertical AT / NT */}
            {/* Posición del libro 39 (Malaquías) aprox X = 30 + (38/65)*715 = 448 */}
            <line x1="454" y1="10" x2="454" y2="195" stroke="#3b82f6" strokeOpacity="0.3" strokeDasharray="4 4" strokeWidth="1.5" />
            <text x="445" y="14" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="monospace">
              ANTIGUO TESTAMENTO (39)
            </text>
            <text x="462" y="14" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="start" fontFamily="monospace">
              NUEVO TESTAMENTO (27)
            </text>

            {/* Etiquetas de Eje Y */}
            <text x="24" y="24" fill="currentColor" fillOpacity="0.4" fontSize="9" textAnchor="end" fontFamily="monospace">
              {maxCount}
            </text>
            <text x="24" y="105" fill="currentColor" fillOpacity="0.4" fontSize="9" textAnchor="end" fontFamily="monospace">
              {Math.round(maxCount / 2)}
            </text>
            <text x="24" y="188" fill="currentColor" fillOpacity="0.4" fontSize="9" textAnchor="end" fontFamily="monospace">
              0
            </text>

            {/* Líneas de conexión o tendencia */}
            {CANONICAL_BOOKS.map((book, idx) => {
              if (idx === 0) return null;
              const prevBook = CANONICAL_BOOKS[idx - 1];
              const prevX = 35 + ((idx - 1) / 65) * 700;
              const currX = 35 + (idx / 65) * 700;
              const prevY = getYPosition(lemmaData.distributionByBook[prevBook.abbreviation] || 0);
              const currY = getYPosition(lemmaData.distributionByBook[book.abbreviation] || 0);

              // Solo dibujar si pertenecen al mismo testamento para evitar saltos canónicos
              if (prevBook.testament !== book.testament) return null;

              return (
                <line
                  key={`line-${book.id}`}
                  x1={prevX}
                  y1={prevY}
                  x2={currX}
                  y2={currY}
                  stroke="#3b82f6"
                  strokeOpacity="0.3"
                  strokeWidth="1.2"
                />
              );
            })}

            {/* Puntos de dispersión de cada uno de los 66 libros */}
            {CANONICAL_BOOKS.map((book, idx) => {
              const count = lemmaData.distributionByBook[book.abbreviation] || 0;
              const cx = 35 + (idx / 65) * 700;
              const cy = getYPosition(count);
              const r = getRadius(count);
              const isHovered = hoveredBookAbbr === book.abbreviation;
              const dotColor = '#3b82f6';

              return (
                <g
                  key={book.id}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredBookAbbr(book.abbreviation)}
                  onMouseLeave={() => setHoveredBookAbbr(null)}
                  onClick={() => setHoveredBookAbbr(book.abbreviation)}
                >
                  {/* Halo de hover */}
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r + 6}
                      fill={dotColor}
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Punto principal */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? r + 2 : r}
                    fill={count > 0 ? dotColor : 'currentColor'}
                    fillOpacity={count > 0 ? (isHovered ? 1 : 0.85) : 0.2}
                    stroke={count > 0 ? '#fff' : 'none'}
                    strokeWidth={count > 0 ? 1 : 0}
                    className="transition-all duration-150"
                  />

                  {/* Abreviatura del libro en el Eje X */}
                  <text
                    x={cx}
                    y="202"
                    fill={isHovered ? dotColor : 'currentColor'}
                    fillOpacity={isHovered ? 1 : count > 0 ? 0.8 : 0.35}
                    fontSize={isHovered ? "8.5" : "7"}
                    fontWeight={isHovered || count > 0 ? 'bold' : 'normal'}
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {book.abbreviation}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip Dinámico Flotante */}
          {hoveredBook && (
            <div className="absolute top-2 right-2 sm:right-6 p-3 rounded-lg border border-accents-2 bg-background/95 backdrop-blur-md shadow-md text-left z-20 pointer-events-none max-w-xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-xs text-foreground">
                  {hoveredBook.name} ({hoveredBook.abbreviation})
                </span>
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-white bg-blue-500"
                >
                  {hoveredBook.testament === 'OT' ? 'Antiguo Testamento' : 'Nuevo Testamento'}
                </span>
              </div>
              <div className="text-[11px] text-accents-5 font-mono">
                <span className="font-bold text-foreground text-xs">{hoveredCount}</span>{' '}
                {hoveredCount === 1 ? 'aparición' : 'apariciones'} ({hoveredPercentage}% del canon)
              </div>
              <div className="text-[10px] text-accents-4 mt-1 font-mono">
                Libro #{hoveredBook.id} canónico • {getChaptersForBookId(hoveredBook.id)} capítulos
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leyenda de Familias y Géneros Literarios Canónicos */}
      <div className="pt-2 border-t border-accents-2 flex flex-wrap items-center gap-2 text-[10px] font-mono">
        <span className="text-accents-4 uppercase font-semibold">Familias Literarias:</span>
        {genresList.map((genre) => {
          const countInGenre = lemmaData.distributionByGenre[genre] || 0;
          const style = GENRE_COLORS[genre];
          return (
            <span
              key={genre}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
              <span>{genre}:</span>
              <strong className="font-bold">{countInGenre}</strong>
            </span>
          );
        })}
      </div>
    </div>
  );
};
