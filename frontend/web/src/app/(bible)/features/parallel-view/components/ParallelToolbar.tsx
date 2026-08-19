'use client';

import React from 'react';
import { Translation } from '../../translations/hooks/useTranslations';

export type BibleStudyMode =
  | 'standard'
  | 'parallel'
  | 'interlinear'
  | 'literary'
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
  // Encontrar la primera traducción que no esté ya activa para sugerirla al añadir
  const nextAvailableTranslation = availableTranslations.find(
    (t) => !activeTranslationIds.includes(t.id),
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
            Vista Estándar
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
            Vista Paralela
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
            Interlineal Inverso
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
            Quiasmos & Discurso
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('lexicon')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'lexicon'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Léxicos & Diccionarios
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('grammar-search')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'grammar-search'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Búsqueda Morfológica
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('atlas')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'atlas'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Atlas & 3D
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('timeline')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'timeline'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Línea de Tiempo
          </button>
          <button
            type="button"
            onClick={() => onChangeStudyMode('archaeology')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              studyMode === 'archaeology'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Actualidad Arqueológica
          </button>
        </div>

        {studyMode === 'parallel' && (
          <span className="hidden sm:inline-flex text-[11px] font-mono text-accents-4 px-2 py-0.5 rounded border border-accents-2">
            {columnCount} / 4 columnas
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
              title="Añadir otra versión para comparar"
            >
              <svg
                className="w-3.5 h-3.5 text-accents-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Añadir Columna</span>
            </button>
          )}

          <div className="text-[11px] text-accents-4 font-mono hidden md:block">
            Alineación versículo por versículo
          </div>
        </div>
      )}

      {/* Indicador para vista interlineal */}
      {studyMode === 'interlinear' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          Interlineal Inverso e Interactivo con Audio Bíblico
        </div>
      )}

      {/* Indicador para vista literaria */}
      {studyMode === 'literary' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          Estructuras Poéticas Semíticas y Gramática Paulina
        </div>
      )}

      {/* Indicador para vista de léxicos */}
      {studyMode === 'lexicon' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          BDB • Gesenius • DTAT • Thayer • LSJ • Robertson • Vincent
        </div>
      )}

      {/* Indicador para vista de búsqueda morfológica */}
      {studyMode === 'grammar-search' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          Parsing Robinson • Scatter Plot Canónico • SQLite FTS5
        </div>
      )}

      {/* Indicador para vista de Atlas y 3D */}
      {studyMode === 'atlas' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          Atlas Georreferenciado • Rutas Bíblicas • Modelos 3D Arqueológicos
        </div>
      )}

      {/* Indicador para vista de Línea de Tiempo */}
      {studyMode === 'timeline' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          Cronología Sincrónica • Reyes de Judá e Israel • Profetas • Imperios Mundiales
        </div>
      )}

      {/* Indicador para vista de Actualidad Arqueológica */}
      {studyMode === 'archaeology' && (
        <div className="text-[11px] text-accents-4 font-mono hidden sm:block">
          Hallazgos en Tierra Santa • Manuscritos de Qumrán • Epigrafía • Apologética Histórica
        </div>
      )}
    </div>
  );
};




