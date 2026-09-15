'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useEvangelism } from '../hooks/useEvangelism';
import { useEvangelismContextSafe } from '../context/EvangelismContext';
import { PathwayViewer } from './PathwayViewer';
import { ObjectionsExplorer } from './ObjectionsExplorer';
import { TractsExplorer } from './TractsExplorer';
import { EvangelismTab } from '../types';

interface EvangelismWorkspaceProps {
  initialTab?: EvangelismTab;
  initialSubSuite?: EvangelismTab; // Alias de compatibilidad
}

export const EvangelismWorkspace: React.FC<EvangelismWorkspaceProps> = ({ initialTab, initialSubSuite }) => {
  const t = useTranslations('Evangelism');
  const contextState = useEvangelismContextSafe();
  const localState = useEvangelism();
  const state = contextState || localState;

  const {
    activeTab,
    setActiveTab,
    pathways,
    selectedPathway,
    setSelectedPathwayId,
    activeStepIndex,
    setActiveStepIndex,
    nextStep,
    prevStep,
    objections,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    tracts,
    selectedTract,
    setSelectedTractId,
    isLoading,
  } = state;

  const targetTab = initialTab || initialSubSuite;

  React.useEffect(() => {
    if (targetTab && setActiveTab) {
      setActiveTab(targetTab);
    }
  }, [targetTab, setActiveTab]);

  const tabs: { key: EvangelismTab; label: string }[] = [
    { key: 'pathways', label: t('tabPathways') },
    { key: 'objections', label: t('tabObjections') },
    { key: 'tracts', label: t('tabTracts') },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Barra de Pestañas Geist Minimal */}
      <div className="border-b border-accents-2 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6 -mb-px">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 pt-1 text-xs font-semibold transition-all cursor-pointer border-b-2 ${
                  isActive
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-accents-4 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:block text-[11px] font-mono text-accents-4 pb-2.5">
          {t('motto')}
        </div>
      </div>

      {/* Renderizado Condicional de la Pestaña Activa */}
      {activeTab === 'pathways' && (
        <PathwayViewer
          pathways={pathways}
          selectedPathway={selectedPathway}
          onSelectPathway={setSelectedPathwayId}
          activeStepIndex={activeStepIndex}
          onSelectStep={setActiveStepIndex}
          onNextStep={nextStep}
          onPrevStep={prevStep}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'objections' && (
        <ObjectionsExplorer
          objections={objections}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'tracts' && (
        <TractsExplorer
          tracts={tracts}
          selectedTract={selectedTract}
          onSelectTract={setSelectedTractId}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
