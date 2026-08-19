'use client';

import React, { useState } from 'react';
import { GrammarSearchTab } from '../types';
import { useGrammarSearch } from '../hooks/useGrammarSearch';
import { MorphologyQuickPresets } from './MorphologyQuickPresets';
import { MorphologyFilterForm } from './MorphologyFilterForm';
import { MorphologyResultsList } from './MorphologyResultsList';
import { LemmaFrequencyAnalysis } from './LemmaFrequencyAnalysis';
import { ExhaustiveConcordanceSearch } from './ExhaustiveConcordanceSearch';

export const GrammarSearchDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GrammarSearchTab>('morphology');

  const {
    filters,
    presets,
    activePresetId,
    results,
    updateFilter,
    applyPreset,
    resetFilters,
    toggleCustomBook,
  } = useGrammarSearch();

  return (
    <div className="space-y-6">
      {/* Sub-Navegación de Pestañas del Motor Lingüístico */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl border border-accents-2 bg-background">
        <div className="inline-flex p-1 rounded-lg bg-accents-1 border border-accents-2 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('morphology')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'morphology'
                ? 'bg-background text-foreground shadow-xs font-bold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Filtro Morfológico (Grammar Search)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lemma_scatter')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'lemma_scatter'
                ? 'bg-background text-foreground shadow-xs font-bold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Análisis de Raíz & Scatter Plot Canónico
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('concordance')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'concordance'
                ? 'bg-background text-foreground shadow-xs font-bold'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Concordancia Exhaustiva FTS5
          </button>
        </div>

        <div className="text-[11px] font-mono text-accents-4 px-2 hidden md:block">
          {activeTab === 'morphology'
            ? 'Filtrado por parsing Robinson, tiempo, voz, modo y casos'
            : activeTab === 'lemma_scatter'
            ? 'Distribución cuantitativa en los 66 libros del canon'
            : 'Búsqueda instantánea con comodines, frases y booleanos'}
        </div>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {activeTab === 'morphology' && (
        <div className="space-y-6">
          {/* Presets Rápidos */}
          <MorphologyQuickPresets
            presets={presets}
            activePresetId={activePresetId}
            onSelectPreset={applyPreset}
          />

          {/* Formulario de Filtros */}
          <MorphologyFilterForm
            filters={filters}
            onUpdateFilter={updateFilter}
            onResetFilters={resetFilters}
            onToggleCustomBook={toggleCustomBook}
          />

          {/* Lista de Resultados */}
          <MorphologyResultsList results={results} />
        </div>
      )}

      {activeTab === 'lemma_scatter' && <LemmaFrequencyAnalysis />}

      {activeTab === 'concordance' && <ExhaustiveConcordanceSearch />}
    </div>
  );
};
