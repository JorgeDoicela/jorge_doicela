'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GrammarSearchTab } from '../types';
import { useGrammarSearch } from '../hooks/useGrammarSearch';
import { MorphologyQuickPresets } from './MorphologyQuickPresets';
import { MorphologyFilterForm } from './MorphologyFilterForm';
import { MorphologyResultsList } from './MorphologyResultsList';
import { LemmaFrequencyAnalysis } from './LemmaFrequencyAnalysis';
import { ExhaustiveConcordanceSearch } from './ExhaustiveConcordanceSearch';
import { OngoingExpansionNotice } from '../../../components/OngoingExpansionNotice';

export const GrammarSearchDashboard: React.FC = () => {
  const t = useTranslations('GrammarSearch');
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
            {t('tabs.morphology')}
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
            {t('tabs.scatter')}
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
            {t('tabs.concordance')}
          </button>
        </div>

        <div className="text-[11px] font-mono text-accents-4 hidden lg:block pr-2">
          {t('headerSubtitle')}
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
          contextTitle={t('expansionTitle')}
          contextDescription={t('expansionDesc')}
          activeItemsSummary={t('expansionSummary')}
        />
      </div>
    </div>
  );
};
