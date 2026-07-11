import React from 'react';
import { Verse } from '../../types';

interface VerseCardProps {
  verse: Verse;
}

export const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  return (
    <div className="p-6 rounded-lg bg-card-bg border border-border transition-all duration-200 hover:border-accents-5 hover:bg-card-hover">
      <div className="flex justify-between items-center mb-4">
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-accents-1 text-accents-5 border border-border">
          {typeof verse.book === 'object' && verse.book !== null ? (verse.book as any).name : verse.book}
        </span>
        <span className="text-xs font-mono text-accents-4">
          {verse.chapter}:{verse.verseNumber}
        </span>
      </div>
      <p className="text-base leading-relaxed text-foreground">
        {verse.text}
      </p>
    </div>
  );
};

