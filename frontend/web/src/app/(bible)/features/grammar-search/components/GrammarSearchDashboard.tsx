'use client';

import React, { useState } from 'react';
import { GrammarSearchTab } from '../types';
import { useGrammarSearch } from '../hooks/useGrammarSearch';
import { MorphologyQuickPresets } from './MorphologyQuickPresets';
import { MorphologyFilterForm } from './MorphologyFilterForm';
import { MorphologyResultsList } from './MorphologyResultsList';
import { LemmaFrequencyAnalysis } from './LemmaFrequencyAnalysis';
import { ExhaustiveConcordanceSearch } from './ExhaustiveConcordanceSearch';
import { OngoingExpansionNotice } from '../../../components/OngoingExpansionNotice';

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
            Buscador Booleano & Concordancia
          </button>
        </div>

        <div className="text-[11px] font-mono text-accents-4 hidden lg:block pr-2">
          Análisis sintáctico y lematización de textos originales
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

      {/* Aviso de Expansión Continua de Tagging Morfológico */}
      <div className="pt-6">
        <OngoingExpansionNotice
          contextTitle="Motor de Búsqueda Morfológica en Crecimiento"
          contextDescription="Esta es una plataforma nueva que está en constante desarrollo. Me esfuerzo al máximo por realizar un trabajo minucioso y de excelencia, etiquetando cada raíz, binyan hebreo (Qal, Piel, Hifil), tiempo verbal griego y caso sintáctico en todo el corpus bíblico."
          activeItemsSummary="Consultas sintácticas activas: Verbos Aoristos en Juan y Romanos, Participios Absolutos y Formas Cohortativas."
        />
      </div>
    </div>
  );
};
