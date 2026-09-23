'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { InterlinearView } from '../../../features/interlinear';
import { useBiblePassage } from '../../../shared/context';
import { BiblePassageToolbar } from '../../../widgets/bible-passage-toolbar';

export default function InterlinearStudyPage() {
  const t = useTranslations('Interlinear');
  const { selectedBook, selectedChapter } = useBiblePassage();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 animate-in fade-in duration-200">
      <BiblePassageToolbar
        rightBadge={
          <span className="text-[11px] font-mono text-amber-500/90 font-semibold">
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
