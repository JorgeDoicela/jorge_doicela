'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LiteraryViewSubMode } from '../types';
import { ChiasmViewer } from './ChiasmViewer';
import { PaulineDiscourseViewer } from './PaulineDiscourseViewer';
import { OngoingExpansionNotice } from '../../../components/OngoingExpansionNotice';

export const LiteraryAnalysisView: React.FC = () => {
  const t = useTranslations('LiteraryAnalysis');
  const [subMode, setSubMode] = useState<LiteraryViewSubMode>('poetic_chiasm');

  return (
    <div className="space-y-6">
      {/* Selector de Submódulo Literario */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-accents-2 bg-accents-1/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accents-4">
            {t('axisTitle')}
          </span>
          <div className="inline-flex rounded-lg border border-accents-2 bg-background p-1 text-xs">
            <button
              type="button"
              onClick={() => setSubMode('poetic_chiasm')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                subMode === 'poetic_chiasm'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              {t('chiasmsTab')}
            </button>
            <button
              type="button"
              onClick={() => setSubMode('pauline_discourse')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                subMode === 'pauline_discourse'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              {t('paulineTab')}
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-accents-4 hidden md:block">
          {subMode === 'poetic_chiasm'
            ? t('chiasmSubtitle')
            : t('paulineSubtitle')}
        </div>
      </div>

      {/* Renderizado del Submódulo */}
      {subMode === 'poetic_chiasm' ? (
        <ChiasmViewer />
      ) : (
        <PaulineDiscourseViewer />
      )}

      {/* Aviso de Expansión Continua de Quiasmos y Discursos */}
      <div className="pt-6">
        <OngoingExpansionNotice
          contextTitle={t('expansionTitle')}
          activeItemsSummary={t('expansionSummary')}
        />
      </div>
    </div>
  );
};
