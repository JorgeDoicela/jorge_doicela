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
        alwaysShowPicker
        rightBadge={
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 font-medium">
            {tStudio('dictionariesTitle')}
          </span>
        }
      />
      <DictionariesDashboard />
    </div>
  );
}
