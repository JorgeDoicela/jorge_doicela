import React from 'react';
import { Verse } from '../../types';

interface VerseCardProps {
  verse: Verse;
}

export const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  const bookName =
    typeof verse.book === 'object' && verse.book !== null
      ? verse.book.name
      : verse.book;

  return (
    <div className="p-5 rounded-lg bg-background border border-accents-2 transition-all duration-150 hover:border-foreground flex flex-col justify-between min-h-[140px]">
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground tracking-tight">
              {bookName}
            </span>
            <span className="text-[11px] font-mono text-accents-5">
              {verse.chapter}:{verse.verseNumber}
            </span>
          </div>
          {verse.translation && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-accents-1 text-accents-5 border border-accents-2">
              {verse.translation.abbreviation}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-accents-6">
          {verse.text}
        </p>
      </div>
    </div>
  );
};

