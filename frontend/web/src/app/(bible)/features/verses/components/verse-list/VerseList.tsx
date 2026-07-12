'use client';

import React from 'react';
import { VerseCard } from '../verse-card/VerseCard';
import { Verse } from '../../types';

interface VerseListProps {
  verses: Verse[];
  loading: boolean;
  error: string | null;
}

export const VerseList: React.FC<VerseListProps> = ({ verses, loading, error }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-lg border border-accents-2 bg-background flex flex-col justify-between min-h-[140px] animate-pulse"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4.5 w-16 bg-accents-1 rounded" />
                    <div className="h-3 w-8 bg-accents-1 rounded" />
                  </div>
                  <div className="h-4.5 w-10 bg-accents-1 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-accents-1 rounded" />
                  <div className="h-3.5 w-11/12 bg-accents-1 rounded" />
                  <div className="h-3.5 w-3/4 bg-accents-1 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-red-500 text-xs font-mono text-center mb-6">
          {error}
        </div>
      )}

      {!loading && !error && verses.length === 0 && (
        <p className="text-center text-accents-5 text-sm py-12">
          No se encontraron versículos para esta selección.
        </p>
      )}

      {!loading && !error && verses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verses.map((verse) => (
            <VerseCard key={verse.id} verse={verse} />
          ))}
        </div>
      )}
    </div>
  );
};

