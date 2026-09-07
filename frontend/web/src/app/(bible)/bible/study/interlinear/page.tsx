'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { InterlinearView } from '../../../features/interlinear';
import { useBiblePassage } from '../../../context/BiblePassageContext';
import { BiblePassageToolbar } from '../../../components/BiblePassageToolbar';

export default function InterlinearStudyPage() {
  const t = useTranslations('Interlinear');
  const { selectedBook, selectedChapter } = useBiblePassage();

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <BiblePassageToolbar
        rightBadge={
          <span className="text-[11px] font-mono text-amber-500/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            {selectedBook?.testament === 'NT' ? t('activeOriginalBadgeNt') : t('activeOriginalBadgeOt')}
          </span>
        }
      />

      <section className="space-y-3">
        <InterlinearView
          selectedBookAbbr={selectedBook?.abbreviation}
          chapter={selectedChapter}
          testament={selectedBook?.testament}
        />
      </section>
    </div>
  );
}
