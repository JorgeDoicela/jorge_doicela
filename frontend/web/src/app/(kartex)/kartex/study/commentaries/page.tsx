'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CommentariesDashboard } from '../../../features/commentaries';
import { KartexPassageToolbar } from '../../../widgets/kartex-passage-toolbar';

export default function CommentariesStudyPage() {
  const tStudio = useTranslations('Studio');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-in fade-in duration-200">
      <KartexPassageToolbar
        rightBadge={
          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            {tStudio('commentariesTitle')}
          </span>
        }
      />
      <CommentariesDashboard />
    </div>
  );
}
