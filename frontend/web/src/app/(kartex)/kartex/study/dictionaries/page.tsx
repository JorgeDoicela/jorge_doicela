'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { DictionariesDashboard } from '../../../features/dictionaries';
import { KartexPassageToolbar } from '../../../widgets/kartex-passage-toolbar';

export default function DictionariesStudyPage() {
  const tStudio = useTranslations('Studio');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-in fade-in duration-200">
      <KartexPassageToolbar
        rightBadge={
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {tStudio('dictionariesTitle')}
          </span>
        }
      />
      <DictionariesDashboard />
    </div>
  );
}
