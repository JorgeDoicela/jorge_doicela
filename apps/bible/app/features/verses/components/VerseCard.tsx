import React from 'react';
import { Verse } from '../types';

interface VerseCardProps {
  verse: Verse;
}

export const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {verse.book}
        </span>
        <span className="text-sm font-medium text-slate-400">
          {verse.chapter}:{verse.verseNumber}
        </span>
      </div>
      <p className="text-lg leading-relaxed text-slate-100 italic">
        {"\""}{verse.text}{"\""}
      </p>
    </div>
  );
};
