'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AtlasDashboard } from '../features/atlas';
import { TimelineDashboard } from '../features/timeline';
import { ArchaeologyFeedDashboard } from '../features/archaeology-feed';
import { Map, Clock, Landmark } from 'lucide-react';

export type HistoricalContextSubTab = 'atlas' | 'timeline' | 'archaeology';

interface HistoricalContextViewProps {
  initialSubTab?: HistoricalContextSubTab;
}

export const HistoricalContextView: React.FC<HistoricalContextViewProps> = ({
  initialSubTab = 'atlas',
}) => {
  const t = useTranslations('HistoricalContext');
  const [subTab, setSubTab] = useState<HistoricalContextSubTab>(initialSubTab);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Barra de Selección de Submódulo de Contexto Histórico & Geográfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-accents-2 bg-accents-1/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accents-4 hidden sm:inline">
            {t('axisTitle')}
          </span>
          <div className="inline-flex flex-wrap rounded-lg border border-accents-2 bg-background p-1 text-xs gap-1">
            <button
              type="button"
              onClick={() => setSubTab('atlas')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === 'atlas'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{t('atlasTab')}</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('timeline')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === 'timeline'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{t('timelineTab')}</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('archaeology')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === 'archaeology'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{t('archaeologyTab')}</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-accents-4 hidden md:block">
          {subTab === 'atlas'
            ? t('atlasSubtitle')
            : subTab === 'timeline'
            ? t('timelineSubtitle')
            : t('archaeologySubtitle')}
        </div>
      </div>

      {/* Renderizado de la herramienta seleccionada */}
      {subTab === 'atlas' && <AtlasDashboard />}
      {subTab === 'timeline' && <TimelineDashboard />}
      {subTab === 'archaeology' && <ArchaeologyFeedDashboard />}
    </div>
  );
};
