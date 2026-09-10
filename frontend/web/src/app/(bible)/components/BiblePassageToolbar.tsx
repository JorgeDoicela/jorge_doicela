'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { UnifiedPassagePicker } from '../features/books';
import { useBiblePassage } from '../context/BiblePassageContext';

interface BiblePassageToolbarProps {
  rightBadge?: React.ReactNode;
}

export const BiblePassageToolbar: React.FC<BiblePassageToolbarProps> = ({ rightBadge }) => {
  const t = useTranslations('Toolbar');
  const {
    books,
    selectedBookId,
    selectedChapter,
    setPassage,
    nextChapter,
    prevChapter,
    isLeftSidebarOpen,
  } = useBiblePassage();

  return (
    <section className="relative z-30 border border-accents-2 rounded-xl bg-background p-2 sm:p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 ${isLeftSidebarOpen ? 'lg:hidden' : 'animate-in fade-in duration-200'}`}>
          <span className="text-[11px] font-mono uppercase tracking-wider text-accents-5 hidden sm:inline whitespace-nowrap">
            {t('activePassage')}
          </span>
          <UnifiedPassagePicker
            books={books}
            selectedBookId={selectedBookId}
            selectedChapter={selectedChapter}
            onSelectPassage={setPassage}
            onPrevChapter={prevChapter}
            onNextChapter={nextChapter}
            size="sm"
          />
        </div>
      </div>

      {rightBadge && <div className="flex items-center gap-2">{rightBadge}</div>}
    </section>
  );
};
