'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useEvangelism } from '../hooks/useEvangelism';
import { PathwayViewer } from './PathwayViewer';
import { ObjectionsExplorer } from './ObjectionsExplorer';
import { TractsExplorer } from './TractsExplorer';
import { EvangelismSubSuite } from '../types';

export const EvangelismWorkspace: React.FC = () => {
  const t = useTranslations('Evangelism');
  const {
    subSuite,
    setSubSuite,
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
  } = useEvangelism();

  const suites: { key: EvangelismSubSuite; label: string }[] = [
    { key: 'pathways', label: t('tabPathways') },
    { key: 'objections', label: t('tabObjections') },
    { key: 'tracts', label: t('tabTracts') },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Barra de Sub-Suites Geist Minimal */}
      <div className="border-b border-accents-2 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6 -mb-px">
          {suites.map((s) => {
            const isActive = subSuite === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSubSuite(s.key)}
                className={`pb-3 pt-1 text-xs font-semibold transition-all cursor-pointer border-b-2 ${
                  isActive
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-accents-4 hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:block text-[11px] font-mono text-accents-4 pb-2.5">
          {t('suiteMotto')}
        </div>
      </div>

      {/* Renderizado Condicional de la Sub-Suite */}
      {subSuite === 'pathways' && (
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

      {subSuite === 'objections' && (
        <ObjectionsExplorer
          objections={objections}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isLoading}
        />
      )}

      {subSuite === 'tracts' && (
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
